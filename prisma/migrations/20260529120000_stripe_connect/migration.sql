-- Stripe Connect on organizations; payment links on invoices
ALTER TABLE "Organization" ADD COLUMN "stripeConnectAccountId" TEXT;
ALTER TABLE "Organization" ADD COLUMN "stripeConnectChargesEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN "stripeConnectPayoutsEnabled" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "Organization_stripeConnectAccountId_key" ON "Organization"("stripeConnectAccountId");

ALTER TABLE "Invoice" ADD COLUMN "stripePaymentLinkId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "stripePaymentLinkUrl" TEXT;
