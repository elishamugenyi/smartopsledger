import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { SettingsContent } from "@/app/components/dashboard/settings-content";
import { DashboardTopbar } from "@/app/components/dashboard/dashboard-topbar";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const { accessState, userId } = await requireDashboardUser({ requireOrganization: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      subscriptionStatus: true,
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-white">
      <DashboardTopbar title="Settings" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar isLocked={accessState.isLocked} />
        <main>
          <SettingsContent
            profile={{
              name: user.name,
              email: user.email,
              createdAt: user.createdAt.toISOString(),
              subscriptionStatus: user.subscriptionStatus,
            }}
          />
        </main>
      </div>
    </div>
  );
}
