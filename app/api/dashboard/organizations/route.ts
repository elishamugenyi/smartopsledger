import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrganizationForUser } from "@/lib/organization";

type CreateOrganizationBody = {
  name?: string;
};

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const organizations = await prisma.organizationMember.findMany({
    where: { userId: auth.user.id },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          ownerId: true,
          members: {
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
            orderBy: { id: "asc" },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ organizations }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as CreateOrganizationBody | null;
  const name = body?.name?.trim();

  if (!name) {
    return NextResponse.json(
      {
        error: "ORGANIZATION_NAME_REQUIRED",
        hint: "Use names like Finance, Sales, Accounting, Legal, or Sole.",
      },
      { status: 400 },
    );
  }

  const organization = await createOrganizationForUser(auth.user.id, name);

  return NextResponse.json(
    {
      organization,
      hint: "You were added as ADMIN. Only one admin is allowed per organization.",
    },
    { status: 201 },
  );
}
