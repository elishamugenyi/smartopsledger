import { SettingsContent } from "@/app/components/dashboard/settings-content";
import { requireDashboardUser } from "@/lib/dashboard-access";
import {
  getManageableOrganizationsForUser,
  getPrimaryOrganizationIdForUser,
} from "@/lib/organization";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const { userId } = await requireDashboardUser({ requireOrganization: false });

  const [user, organizationId, manageableOrganizations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true,
        subscriptionStatus: true,
      },
    }),
    getPrimaryOrganizationIdForUser(userId),
    getManageableOrganizationsForUser(userId),
  ]);

  if (!user) return null;

  const defaultOrganizationId =
    manageableOrganizations.find((organization) => organization.id === organizationId)?.id ??
    manageableOrganizations[0]?.id ??
    organizationId;

  return (
    <div className="p-4 sm:p-6">
      <SettingsContent
        profile={{
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          subscriptionStatus: user.subscriptionStatus,
        }}
        paymentsConnect={{
          organizations: manageableOrganizations,
          defaultOrganizationId,
          canManage: manageableOrganizations.length > 0,
        }}
      />
    </div>
  );
}
