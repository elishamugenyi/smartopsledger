import { prisma } from "@/lib/prisma";

export async function getPrimaryOrganizationMembership(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return membership;
}

export async function getPrimaryOrganizationIdForUser(userId: string) {
  const membership = await getPrimaryOrganizationMembership(userId);
  return membership?.organizationId ?? null;
}

export async function createOrganizationForUser(userId: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("ORGANIZATION_NAME_REQUIRED");
  }

  const organization = await prisma.organization.create({
    data: {
      name: trimmedName,
      ownerId: userId,
      members: {
        create: {
          userId,
          // Keep one admin per organization. Creator starts as the admin.
          role: "ADMIN",
        },
      },
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });

  return organization;
}

export async function userCanManageOrganization(userId: string, organizationId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId, organizationId },
    select: { role: true },
  });

  return Boolean(membership && (membership.role === "ADMIN" || membership.role === "OWNER"));
}
