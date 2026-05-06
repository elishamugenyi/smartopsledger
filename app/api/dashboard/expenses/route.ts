import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserTenantContext } from "@/lib/tenant-access";

type CreateExpenseBody = {
  amount?: number;
  category?: string;
  description?: string;
};

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { organizationIds, primaryOrganizationId } = await getUserTenantContext(auth.user.id);
  if (!primaryOrganizationId || organizationIds.length === 0) {
    return NextResponse.json(
      {
        error: "ORGANIZATION_REQUIRED",
        hint: "Create or join an organization in the Organization tab first.",
      },
      { status: 400 },
    );
  }

  const entries = await prisma.expense.findMany({
    where: { organizationId: { in: organizationIds } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ entries }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as CreateExpenseBody | null;
  const amount = body?.amount;
  const category = body?.category?.trim().toLowerCase();
  const description = body?.description?.trim();

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "VALID_AMOUNT_REQUIRED" }, { status: 400 });
  }
  if (!category || (category !== "expense" && category !== "revenue")) {
    return NextResponse.json(
      { error: "CATEGORY_MUST_BE_EXPENSE_OR_REVENUE" },
      { status: 400 },
    );
  }

  const { primaryOrganizationId } = await getUserTenantContext(auth.user.id);
  if (!primaryOrganizationId) {
    return NextResponse.json(
      {
        error: "ORGANIZATION_REQUIRED",
        hint: "Create or join an organization in the Organization tab first.",
      },
      { status: 400 },
    );
  }

  const entry = await prisma.expense.create({
    data: {
      organizationId: primaryOrganizationId,
      amount: Math.round(amount * 100),
      category,
      description: description || null,
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
