import type { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDatabaseRetry } from "@/lib/db-connection-error";

export async function getInvoiceStatusTotals(organizationIds: string[]) {
  const groups = await withDatabaseRetry(() =>
    prisma.invoice.groupBy({
      by: ["status"],
      where: { organizationId: { in: organizationIds } },
      _count: { _all: true },
    }),
  );

  let paid = 0;
  let pending = 0;

  for (const group of groups) {
    const count = group._count._all;
    if (group.status === "PAID") {
      paid = count;
    } else if (group.status !== "CANCELLED") {
      pending += count;
    }
  }

  return { paid, pending };
}

export type InvoiceListStatus = Extract<
  InvoiceStatus,
  "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED"
>;
