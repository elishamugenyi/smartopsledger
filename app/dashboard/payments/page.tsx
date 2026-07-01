import { redirect } from "next/navigation";
import { PaymentsContent } from "@/app/components/dashboard/payments-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function PaymentsPage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="p-4 sm:p-6">
      <PaymentsContent />
    </div>
  );
}
