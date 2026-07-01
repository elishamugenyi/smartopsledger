import type { Prisma } from "@prisma/client";

/** Stripe Connect columns on Organization (matches prisma/schema.prisma). */
export type OrganizationStripeConnectRecord = {
  stripeConnectAccountId: string | null;
  stripeConnectChargesEnabled: boolean;
  stripeConnectPayoutsEnabled: boolean;
};

export const organizationStripeConnectSelect = {
  stripeConnectAccountId: true,
  stripeConnectChargesEnabled: true,
  stripeConnectPayoutsEnabled: true,
} as const;

export type OrganizationOnboardRecord = {
  id: string;
  name: string;
} & OrganizationStripeConnectRecord;

export const organizationOnboardSelect = {
  id: true,
  name: true,
  ...organizationStripeConnectSelect,
} as const;

export type OrganizationInvoicePaymentRecord = {
  id: string;
  name: string;
} & OrganizationStripeConnectRecord;

export const organizationInvoicePaymentSelect = {
  id: true,
  name: true,
  ...organizationStripeConnectSelect,
} as const;

/** Use when Prisma Client types lag behind schema (run `npx prisma generate`). */
export function organizationStripeConnectSelectForQuery(): Prisma.OrganizationSelect {
  return organizationStripeConnectSelect as unknown as Prisma.OrganizationSelect;
}

export function organizationOnboardSelectForQuery(): Prisma.OrganizationSelect {
  return organizationOnboardSelect as unknown as Prisma.OrganizationSelect;
}

export function organizationInvoicePaymentSelectForQuery(): Prisma.OrganizationSelect {
  return organizationInvoicePaymentSelect as unknown as Prisma.OrganizationSelect;
}

export function organizationStripeConnectUpdateData(
  account: { charges_enabled?: boolean | null; payouts_enabled?: boolean | null },
) {
  return {
    stripeConnectChargesEnabled: account.charges_enabled ?? false,
    stripeConnectPayoutsEnabled: account.payouts_enabled ?? false,
  };
}
