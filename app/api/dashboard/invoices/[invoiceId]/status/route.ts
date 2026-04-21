import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrimaryOrganizationIdForUser } from "@/lib/organization";

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

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId },
    select: { id: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: nextStatus as "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED",
      paidAt: nextStatus === "PAID" ? new Date() : null,
    },
    select: {
      id: true,
      status: true,
      paidAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ invoice: updated }, { status: 200 });
}
