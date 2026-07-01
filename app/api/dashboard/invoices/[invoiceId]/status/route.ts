import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  databaseUnavailableResponse,
  isDatabaseConnectionError,
  withDatabaseRetry,
} from "@/lib/db-connection-error";
import { prisma } from "@/lib/prisma";
import { getUserTenantContext } from "@/lib/tenant-access";

type UpdateInvoiceStatusBody = {
  status?: "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED";
};

const ALLOWED_STATUSES = new Set([
  "DRAFT",
  "SENT",
  "VIEWED",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { invoiceId } = await context.params;
  const body = (await req.json().catch(() => null)) as UpdateInvoiceStatusBody | null;
  const nextStatus = body?.status?.trim().toUpperCase();

  if (!nextStatus || !ALLOWED_STATUSES.has(nextStatus)) {
    return NextResponse.json({ error: "VALID_STATUS_REQUIRED" }, { status: 400 });
  }

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

  try {
    const updateResult = await withDatabaseRetry(() =>
      prisma.invoice.updateMany({
        where: { id: invoiceId, organizationId: { in: organizationIds } },
        data: {
          status: nextStatus as "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED",
          paidAt: nextStatus === "PAID" ? new Date() : null,
        },
      }),
    );

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
    }

    const updated = await withDatabaseRetry(() =>
      prisma.invoice.findFirst({
        where: { id: invoiceId, organizationId: { in: organizationIds } },
        select: {
          id: true,
          status: true,
          paidAt: true,
          updatedAt: true,
        },
      }),
    );

    if (!updated) {
      return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ invoice: updated }, { status: 200 });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return databaseUnavailableResponse();
    }
    throw error;
  }
}
