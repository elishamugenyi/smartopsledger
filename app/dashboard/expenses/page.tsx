import { redirect } from "next/navigation";
import { ExpensesContent } from "@/app/components/dashboard/expenses-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function ExpensesPage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="p-4 sm:p-6">
      <ExpensesContent />
    </div>
  );
}
