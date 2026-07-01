import { redirect } from "next/navigation";
import { ProfitTaxesContent } from "@/app/components/dashboard/profit-taxes-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function ProfitPage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="p-4 sm:p-6">
      <ProfitTaxesContent />
    </div>
  );
}
