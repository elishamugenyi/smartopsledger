import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { SupportContent } from "@/app/components/dashboard/support-content";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function SupportPage() {
  const { accessState } = await requireDashboardUser({ requireOrganization: false });

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="Support" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />
        <main>
          <SupportContent />
        </main>
      </div>
    </div>
  );
}
