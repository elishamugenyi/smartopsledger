import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  invoicePaymentMethodSelect,
  normalizePaymentMethodsInput,
} from "@/lib/invoice-payment-methods";
import { prisma } from "@/lib/prisma";
import { getUserTenantContext } from "@/lib/tenant-access";

type UpdatePaymentMethodsBody = {
  paymentBankName?: string;
  paymentAccountName?: string;
  paymentAccountNumber?: string;
  paymentSwiftCode?: string;
  paymentOtherMethods?: string;
};

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { invoiceId } = await context.params;
  const body = (await req.json().catch(() => null)) as UpdatePaymentMethodsBody | null;
  if (!body) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
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

  const paymentMethods = normalizePaymentMethodsInput(body);

  const updateResult = await prisma.invoice.updateMany({
    where: { id: invoiceId, organizationId: { in: organizationIds } },
    data: paymentMethods,
  });

  if (updateResult.count === 0) {
    return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId: { in: organizationIds } },
    select: {
      id: true,
      ...invoicePaymentMethodSelect,
      updatedAt: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ invoice }, { status: 200 });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { invoiceId } = await context.params;
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

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId: { in: organizationIds } },
    select: {
      id: true,
      ...invoicePaymentMethodSelect,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ invoice }, { status: 200 });
}
