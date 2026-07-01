import type Stripe from "stripe";
import {
  organizationInvoicePaymentSelect,
  organizationStripeConnectSelect,
  organizationStripeConnectUpdateData,
} from "@/lib/organization-stripe-select";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export type StripeConnectErrorResponse = {
  error: string;
  hint: string;
  status: number;
};

export function formatStripeConnectError(error: unknown): StripeConnectErrorResponse {
  if (error && typeof error === "object" && "message" in error) {
    const message =
      typeof error.message === "string" ? error.message : "Stripe Connect request failed.";

    if (
      message.includes("platform-profile") ||
      message.includes("managing losses for connected accounts")
    ) {
      return {
        error: "STRIPE_PLATFORM_SETUP_REQUIRED",
        hint:
          "Complete Stripe Connect platform setup in your Stripe Dashboard (Settings → Connect → Platform profile), then try again.",
        status: 503,
      };
    }

    if ("type" in error && error.type === "StripeInvalidRequestError") {
      return {
        error: "STRIPE_CONNECT_FAILED",
        hint: message,
        status: 502,
      };
    }
  }

  const message = error instanceof Error ? error.message : "Stripe Connect request failed.";
  return {
    error: "STRIPE_CONNECT_FAILED",
    hint: message,
    status: 500,
  };
}

/** Recover a Connect account created in Stripe but not linked in the database. */
export async function getLinkedStripeConnectAccountIds(): Promise<Set<string>> {
  const organizations = await prisma.organization.findMany({
    where: { stripeConnectAccountId: { not: null } },
    select: { stripeConnectAccountId: true },
  });

  return new Set(
    organizations
      .map((organization) => organization.stripeConnectAccountId)
      .filter((accountId): accountId is string => Boolean(accountId)),
  );
}

export async function getOrganizationMemberEmails(organizationId: string): Promise<Set<string>> {
  const [members, organization] = await Promise.all([
    prisma.organizationMember.findMany({
      where: { organizationId },
      select: { user: { select: { email: true } } },
    }),
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { owner: { select: { email: true } } },
    }),
  ]);

  const emails = new Set<string>();
  for (const member of members) {
    const email = member.user.email?.trim().toLowerCase();
    if (email) emails.add(email);
  }

  const ownerEmail = organization?.owner.email?.trim().toLowerCase();
  if (ownerEmail) emails.add(ownerEmail);

  return emails;
}

export async function findStripeAccountForOrganization(
  stripe: Stripe,
  organizationId: string,
): Promise<Stripe.Account | null> {
  const linkedIds = await getLinkedStripeConnectAccountIds();
  const orgEmails = await getOrganizationMemberEmails(organizationId);
  let startingAfter: string | undefined;
  let emailMatch: Stripe.Account | null = null;

  for (let page = 0; page < 10; page += 1) {
    const result = await stripe.accounts.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const account of result.data) {
      if (account.metadata?.organizationId === organizationId) {
        return account;
      }

      if (linkedIds.has(account.id)) continue;

      const accountEmail = account.email?.trim().toLowerCase();
      if (accountEmail && orgEmails.has(accountEmail) && !emailMatch) {
        emailMatch = account;
      }
    }

    if (!result.has_more || result.data.length === 0) break;
    startingAfter = result.data[result.data.length - 1]?.id;
  }

  return emailMatch;
}

export async function linkOrganizationStripeAccount(
  organizationId: string,
  accountId: string,
  account?: Stripe.Account,
) {
  const stripe = getStripe();
  const resolved = account ?? (await stripe.accounts.retrieve(accountId));

  if (resolved.metadata?.organizationId !== organizationId) {
    await stripe.accounts.update(accountId, {
      metadata: {
        ...resolved.metadata,
        organizationId,
        platform: "smartops_ledger",
      },
    });
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      stripeConnectAccountId: accountId,
      ...organizationStripeConnectUpdateData(resolved),
    },
  });

  return resolved;
}

export function formatConnectNotReadyHint(account: Stripe.Account): string {
  const due = account.requirements?.currently_due ?? account.requirements?.past_due ?? [];
  if (due.length > 0) {
    return `Finish Stripe onboarding before sending invoices. Stripe still needs: ${due.join(", ")}.`;
  }

  if (account.requirements?.disabled_reason) {
    return `Finish Stripe onboarding before sending invoices (${account.requirements.disabled_reason.replace(/_/g, " ")}).`;
  }

  return "Finish Stripe onboarding before sending invoices with payment links.";
}

export async function getOrganizationInvoicePaymentRecord(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    select: organizationInvoicePaymentSelect,
  });
}

/** Ensure DB has the latest Connect account id and capability flags for an organization. */
export async function resolveOrganizationConnectState(organizationId: string) {
  let organization = await getOrganizationInvoicePaymentRecord(organizationId);

  if (!organization?.stripeConnectAccountId) {
    const stripe = getStripe();
    const recovered = await findStripeAccountForOrganization(stripe, organizationId);
    if (recovered) {
      await linkOrganizationStripeAccount(organizationId, recovered.id, recovered);
      organization = await getOrganizationInvoicePaymentRecord(organizationId);
    }
  }

  if (organization?.stripeConnectAccountId) {
    await refreshOrganizationConnectStatus(organizationId);
    organization = await getOrganizationInvoicePaymentRecord(organizationId);
  }

  return organization;
}

const DEFAULT_FEE_BPS = 250; // 2.5%

/** Platform application fee in cents (configurable via STRIPE_PLATFORM_FEE_BPS, default 2.5%). */
export function calculatePlatformFeeCents(amountCents: number): number {
  const bps = Number(process.env.STRIPE_PLATFORM_FEE_BPS ?? DEFAULT_FEE_BPS);
  if (!Number.isFinite(bps) || bps < 0) {
    return Math.floor(amountCents * (DEFAULT_FEE_BPS / 10_000));
  }

  const fee = Math.floor((amountCents * bps) / 10_000);
  const minFee = Number(process.env.STRIPE_PLATFORM_FEE_MIN_CENTS ?? 0);
  const maxFee = Number(process.env.STRIPE_PLATFORM_FEE_MAX_CENTS ?? amountCents);

  if (Number.isFinite(minFee) && fee < minFee) return Math.min(minFee, amountCents);
  if (Number.isFinite(maxFee) && fee > maxFee) return maxFee;
  return Math.max(fee, 0);
}

export async function syncOrganizationConnectStatus(
  organizationId: string,
  account: Stripe.Account,
) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: organizationStripeConnectUpdateData(account),
  });
}

export async function refreshOrganizationConnectStatus(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: organizationStripeConnectSelect,
  });

  if (!organization?.stripeConnectAccountId) {
    return {
      stripeConnectAccountId: null as string | null,
      chargesEnabled: false,
      payoutsEnabled: false,
    };
  }

  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(organization.stripeConnectAccountId);
  await syncOrganizationConnectStatus(organizationId, account);

  return {
    stripeConnectAccountId: organization.stripeConnectAccountId,
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
  };
}

export function formatInvoiceLineDescription(
  items: Array<{ description: string; quantity: number; unitPrice: number }>,
): string {
  if (items.length === 0) return "Invoice payment";
  return items
    .map((item) => {
      const lineTotal = (item.quantity * item.unitPrice) / 100;
      return `${item.description} (${item.quantity} × $${lineTotal.toFixed(2)})`;
    })
    .join("; ");
}
