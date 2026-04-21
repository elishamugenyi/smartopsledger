import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { ProfitTaxesContent } from "@/app/components/dashboard/profit-taxes-content";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function ProfitPage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="Profit & Taxes" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />
        <main>
          <ProfitTaxesContent />
        </main>
      </div>
    </div>
  );
}
