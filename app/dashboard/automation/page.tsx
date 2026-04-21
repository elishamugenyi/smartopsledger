import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function AutomationPage() {
  const { accessState } = await requireDashboardUser();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="Automation" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />
        <main className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-black">Automation</h1>
          <p className="mt-2 text-sm text-zinc-600">
            This page is free for all users. You will automate business data and
            operations here in the next phase.
          </p>
        </main>
      </div>
    </div>
  );
}
