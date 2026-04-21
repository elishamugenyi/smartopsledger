import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { RevenueContent } from "@/app/components/dashboard/revenue-content";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function RevenuePage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="Revenue" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />
        <main>
          <RevenueContent />
        </main>
      </div>
    </div>
  );
}
