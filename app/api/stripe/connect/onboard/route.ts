import { NextResponse, type NextRequest } from "next/server";
import { appPath } from "@/lib/app-url";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  findStripeAccountForOrganization,
  formatStripeConnectError,
  linkOrganizationStripeAccount,
  refreshOrganizationConnectStatus,
  syncOrganizationConnectStatus,
} from "@/lib/stripe-connect";
import { organizationOnboardSelect } from "@/lib/organization-stripe-select";
import { getUserTenantContext } from "@/lib/tenant-access";
import { userCanManageOrganization } from "@/lib/organization";

type OnboardBody = {
  organizationId?: string;
};

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "STRIPE_NOT_CONFIGURED" }, { status: 503 });
  }

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as OnboardBody | null;
  const { organizationIds, primaryOrganizationId } = await getUserTenantContext(auth.user.id);

  const organizationId = body?.organizationId?.trim() || primaryOrganizationId;
  if (!organizationId || !organizationIds.includes(organizationId)) {
    return NextResponse.json({ error: "ORGANIZATION_REQUIRED" }, { status: 400 });
  }

  const canManage = await userCanManageOrganization(auth.user.id, organizationId);
  if (!canManage) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: organizationOnboardSelect,
  });

  if (!organization) {
    return NextResponse.json({ error: "ORGANIZATION_NOT_FOUND" }, { status: 404 });
  }

  const stripe = getStripe();
  let accountId = organization.stripeConnectAccountId;

  try {
    if (!accountId) {
      const recovered = await findStripeAccountForOrganization(stripe, organization.id);
      if (recovered) {
        accountId = recovered.id;
        await linkOrganizationStripeAccount(organizationId, accountId, recovered);
      } else {
        const account = await stripe.accounts.create({
          type: "express",
          country: "US",
          email: auth.user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: "company",
          metadata: {
            organizationId: organization.id,
            platform: "smartops_ledger",
          },
        });

        accountId = account.id;

        await prisma.organization.update({
          where: { id: organizationId },
          data: { stripeConnectAccountId: accountId },
        });

        await syncOrganizationConnectStatus(organizationId, account);
      }
    } else {
      await refreshOrganizationConnectStatus(organizationId);
    }

    const account = await stripe.accounts.retrieve(accountId);
    const linkType = account.charges_enabled ? "account_update" : "account_onboarding";

    const returnUrl = appPath(
      "/dashboard/settings/payments/connect/return?organizationId=" +
        encodeURIComponent(organizationId),
    );
    const refreshUrl = appPath(
      "/dashboard/settings/payments/connect/refresh?organizationId=" +
        encodeURIComponent(organizationId),
    );

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: linkType,
    });

    return NextResponse.json(
      {
        url: accountLink.url,
        stripeConnectAccountId: accountId,
        returnUrl,
        refreshUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    const formatted = formatStripeConnectError(error);
    console.error("Stripe Connect onboard error:", error);
    return NextResponse.json(
      { error: formatted.error, hint: formatted.hint },
      { status: formatted.status },
    );
  }
}
