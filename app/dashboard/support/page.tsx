import { SupportContent } from "@/app/components/dashboard/support-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function SupportPage() {
  await requireDashboardUser({ requireOrganization: false });

  return (
    <div className="p-4 sm:p-6">
      <SupportContent />
    </div>
  );
}
