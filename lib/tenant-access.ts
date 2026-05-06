import { prisma } from "@/lib/prisma";

export type UserTenantContext = {
  organizationIds: string[];
  primaryOrganizationId: string | null;
};

export async function getUserTenantContext(userId: string): Promise<UserTenantContext> {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
    orderBy: { id: "asc" },
  });

  const organizationIds = memberships.map((membership) => membership.organizationId);

  return {
    organizationIds,
    primaryOrganizationId: organizationIds[0] ?? null,
  };
}

