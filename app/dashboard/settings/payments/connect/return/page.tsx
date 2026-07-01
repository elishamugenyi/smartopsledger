import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { resolveOrganizationConnectState } from "@/lib/stripe-connect";
import { isStripeConfigured } from "@/lib/stripe";
import { getUserTenantContext } from "@/lib/tenant-access";
type ConnectReturnPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StripeConnectReturnPage({
  searchParams,
}: ConnectReturnPageProps) {
  const { userId } = await requireDashboardUser({ requireOrganization: false });
  const { organizationIds } = await getUserTenantContext(userId);

  const params = (await searchParams) ?? {};
  const organizationIdValue = params.organizationId;
  const organizationId = Array.isArray(organizationIdValue)
    ? organizationIdValue[0]
    : organizationIdValue;

  let chargesEnabled = false;
  let payoutsEnabled = false;
  let hasAccount = false;

  const canAccessOrg = organizationId && organizationIds.includes(organizationId);

  if (isStripeConfigured() && canAccessOrg) {
    const organization = await resolveOrganizationConnectState(organizationId);

    if (organization?.stripeConnectAccountId) {
      hasAccount = true;
      chargesEnabled = organization.stripeConnectChargesEnabled;
      payoutsEnabled = organization.stripeConnectPayoutsEnabled;
    }
  }

  const isReady = chargesEnabled;

  return (
    <div className="p-4 sm:p-6">
      <section className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            isReady
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {isReady ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Clock3 className="h-4 w-4" />
          )}
          {isReady ? "Stripe connected" : "Stripe setup in progress"}
        </div>

        <h1 className="text-2xl font-bold text-black">
          {isReady ? "You can accept invoice payments" : "Almost there"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          {isReady
            ? "Your Stripe Connect account is ready. Client payments will go to your connected Stripe account; SmartOps Ledger collects a platform fee on each paid invoice."
            : hasAccount
              ? "Stripe is still reviewing your account or needs more information. You can return to Settings to continue onboarding."
              : "We could not verify your connected account. Start setup again from Settings."}
        </p>

        {hasAccount ? (
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li>Charges enabled: {chargesEnabled ? "Yes" : "No"}</li>
            <li>Payouts enabled: {payoutsEnabled ? "Yes" : "No"}</li>
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/settings">
            <Button>Back to settings</Button>
          </Link>
          <Link href="/dashboard/invoices">
            <Button variant="outline">Go to invoices</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
