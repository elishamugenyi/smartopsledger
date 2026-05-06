import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserTenantContext } from "@/lib/tenant-access";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { organizationIds } = await getUserTenantContext(auth.user.id);
  if (organizationIds.length === 0) {
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
    select: {
      id: true,
      amount: true,
      category: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totals = entries.reduce(
    (acc, entry) => {
      if (entry.category.toLowerCase() === "revenue") {
        acc.revenue += entry.amount;
      } else {
        acc.expense += entry.amount;
      }
      return acc;
    },
    { revenue: 0, expense: 0 },
  );

  const profitOrLoss = totals.revenue - totals.expense;

  return NextResponse.json(
    {
      entries,
      totals,
      summary: {
        profitOrLoss,
        state: profitOrLoss >= 0 ? "profit" : "loss",
      },
    },
    { status: 200 },
  );
}
