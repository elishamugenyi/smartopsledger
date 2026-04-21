import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userCanManageOrganization } from "@/lib/organization";

type AddOrganizationMemberBody = {
  email?: string;
  role?: "MEMBER" | "ADMIN";
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { organizationId } = await context.params;
  const canManage = await userCanManageOrganization(auth.user.id, organizationId);
  if (!canManage) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        hint: "Only organization admin/owner can add members.",
      },
      { status: 403 },
    );
  }

  const body = (await req.json().catch(() => null)) as AddOrganizationMemberBody | null;
  const email = body?.email?.trim().toLowerCase();
  const requestedRole = body?.role?.toUpperCase() ?? "MEMBER";

  if (!email) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }
  if (!["MEMBER", "ADMIN"].includes(requestedRole)) {
    return NextResponse.json({ error: "INVALID_ROLE" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });
  if (!targetUser) {
    return NextResponse.json(
      {
        error: "USER_NOT_FOUND",
        hint: "Ask the member to create an account first, then add them by email.",
      },
      { status: 404 },
    );
  }

  const existingMembership = await prisma.organizationMember.findFirst({
    where: {
      userId: targetUser.id,
      organizationId,
    },
    select: { id: true, role: true },
  });
  if (existingMembership) {
    return NextResponse.json(
      {
        error: "ALREADY_MEMBER",
        hint: "This user is already in the selected organization.",
      },
      { status: 409 },
    );
  }

  if (requestedRole === "ADMIN") {
    const existingAdmin = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        role: "ADMIN",
      },
      select: { userId: true },
    });

    if (existingAdmin && existingAdmin.userId !== targetUser.id) {
      return NextResponse.json(
        {
          error: "ADMIN_ALREADY_EXISTS",
          hint: "Only one ADMIN is allowed per organization. Add this user as MEMBER.",
        },
        { status: 409 },
      );
    }
  }

  const member = await prisma.organizationMember.create({
    data: {
      organizationId,
      userId: targetUser.id,
      role: requestedRole as "MEMBER" | "ADMIN",
    },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      member,
      hint:
        requestedRole === "ADMIN"
          ? "Admin added successfully. This organization now has its single ADMIN."
          : "Member added successfully. They can use organization data under your subscription.",
    },
    { status: 201 },
  );
}
