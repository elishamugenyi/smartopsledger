import {
  ChartColumnBig,
  FileText,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardStatCard } from "@/app/components/dashboard/dashboard-stat-card";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";

const previewCards = [
  {
    title: "Today's Revenue",
    value: "$12,480",
    detail: "+8.4% from yesterday",
    icon: TrendingUp,
    href: "/dashboard/revenue",
    protected: true,
  },
  {
    title: "Pending Invoices",
    value: "27",
    detail: "5 due this week",
    icon: FileText,
    href: "/dashboard/invoices",
    protected: true,
  },
  {
    title: "Tax Snapshot",
    value: "$1,920",
    detail: "Estimated payable this month",
    icon: Receipt,
    href: "/dashboard/taxes",
  },
];

export default async function DashboardPage() {
  const { accessState } = await requireDashboardUser();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="SmartOps Ledger Dashboard" />

      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />

        <main className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold text-black">Overview</h1>
          {accessState.hasActiveSubscription ? (
            <p className="mt-1 text-sm text-emerald-700">
              Your subscription is active. All dashboard modules are unlocked.
            </p>
          ) : accessState.isTrialActive ? (
            <p className="mt-1 text-sm text-zinc-600">
              Trial active: {accessState.trialDaysRemaining} day
              {accessState.trialDaysRemaining === 1 ? "" : "s"} remaining.
            </p>
          ) : (
            <p className="mt-1 text-sm text-amber-700">
              Your 3-day free access has ended. Locked modules redirect to pricing.
            </p>
          )}

          <section className="mt-5 grid gap-4 md:grid-cols-3">
            {previewCards.map((card) => {
              return (
                <DashboardStatCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  detail={card.detail}
                  icon={card.icon}
                  href={card.href}
                  locked={accessState.isLocked && Boolean(card.protected)}
                />
              );
            })}
          </section>

          <section className="mt-6 rounded-2xl border border-border bg-zinc-50 p-5">
            <div className="flex items-center gap-2">
              <ChartColumnBig className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-black">Dashboard Workspace</h2>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              This layout is now ready for your next phase. We can plug real data into
              each panel (payments, invoices, ledger, taxes) in the next step.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
