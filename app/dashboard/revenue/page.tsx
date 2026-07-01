import { redirect } from "next/navigation";
import { RevenueContent } from "@/app/components/dashboard/revenue-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function RevenuePage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="p-4 sm:p-6">
      <RevenueContent />
    </div>
  );
}
