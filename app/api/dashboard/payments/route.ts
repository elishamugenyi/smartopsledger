import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrimaryOrganizationIdForUser } from "@/lib/organization";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const organizationId = await getPrimaryOrganizationIdForUser(auth.user.id);
  if (!organizationId) {
    return NextResponse.json(
      {
        error: "ORGANIZATION_REQUIRED",
        hint: "Create or join an organization in the Organization tab first.",
      },
      { status: 400 },
    );
  }
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize") || 10), 1),
    50,
  );
  const status = searchParams.get("status")?.trim().toUpperCase();
  const search = searchParams.get("search")?.trim();

  const where = {
    invoice: {
      organizationId,
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: "insensitive" as const } },
              {
                client: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                client: {
                  email: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    },
    ...(status && ["PENDING", "SUCCEEDED", "FAILED"].includes(status)
      ? { status: status as "PENDING" | "SUCCEEDED" | "FAILED" }
      : {}),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            client: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.payment.count({ where }),
  ]);

  return NextResponse.json(
    {
      payments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    },
    { status: 200 },
  );
}
