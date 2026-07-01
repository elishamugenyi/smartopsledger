import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { isStripeConfigured } from "@/lib/stripe";

type ConnectRefreshPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Stripe redirects here when an Account Link expires. User must request a new link.
 */
export default async function StripeConnectRefreshPage({
  searchParams,
}: ConnectRefreshPageProps) {
  await requireDashboardUser({ requireOrganization: false });

  const params = (await searchParams) ?? {};
  const organizationIdValue = params.organizationId;
  const organizationId = Array.isArray(organizationIdValue)
    ? organizationIdValue[0]
    : organizationIdValue;

  if (isStripeConfigured() && organizationId) {
    redirect(`/dashboard/settings?connect=retry&organizationId=${encodeURIComponent(organizationId)}`);
  }

  return (
    <div className="p-4 sm:p-6">
      <section className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
          <AlertCircle className="h-4 w-4" />
          Link expired
        </div>
        <h1 className="text-2xl font-bold text-black">Continue Stripe setup</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Your onboarding link expired. Open Settings and connect Stripe again to get a fresh link.
        </p>
        <div className="mt-6">
          <Link href="/dashboard/settings">
            <Button>Go to settings</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
