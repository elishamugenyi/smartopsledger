import { redirect } from "next/navigation";
import { InvoicesContent } from "@/app/components/dashboard/invoices-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function InvoicesPage() {
  const { accessState } = await requireDashboardUser();
  if (accessState.isLocked) redirect("/pricing");

  return (
    <div className="p-4 sm:p-6">
      <InvoicesContent />
    </div>
  );
}
