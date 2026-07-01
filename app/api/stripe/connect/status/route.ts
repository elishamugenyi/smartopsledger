import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe";
import { resolveOrganizationConnectState } from "@/lib/stripe-connect";
import { getUserTenantContext } from "@/lib/tenant-access";

export async function GET(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "STRIPE_NOT_CONFIGURED" }, { status: 503 });
  }

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const { organizationIds, primaryOrganizationId } = await getUserTenantContext(auth.user.id);
  const organizationId =
    searchParams.get("organizationId")?.trim() || primaryOrganizationId;

  if (!organizationId || !organizationIds.includes(organizationId)) {
    return NextResponse.json({ error: "ORGANIZATION_REQUIRED" }, { status: 400 });
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true },
  });

  if (!organization) {
    return NextResponse.json({ error: "ORGANIZATION_NOT_FOUND" }, { status: 404 });
  }

  const status = await resolveOrganizationConnectState(organizationId);

  if (!status?.stripeConnectAccountId) {
    return NextResponse.json(
      {
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        stripeConnectAccountId: null,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      connected: true,
      chargesEnabled: status.stripeConnectChargesEnabled,
      payoutsEnabled: status.stripeConnectPayoutsEnabled,
      stripeConnectAccountId: status.stripeConnectAccountId,
    },
    { status: 200 },
  );
}
