import { OrganizationContent } from "@/app/components/dashboard/organization-content";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function OrganizationPage() {
  await requireDashboardUser({ requireOrganization: false });

  return (
    <div className="p-4 sm:p-6">
      <OrganizationContent />
    </div>
  );
}
