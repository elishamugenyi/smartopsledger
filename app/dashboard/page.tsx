import { DashboardOverview } from "@/app/components/dashboard/dashboard-overview";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function DashboardPage() {
  const { accessState } = await requireDashboardUser();

  return (
    <div className="p-4 sm:p-6">
      <DashboardOverview accessState={accessState} />
    </div>
  );
}
