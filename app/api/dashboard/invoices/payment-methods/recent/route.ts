import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  hasAnyPaymentMethod,
  invoicePaymentMethodSelect,
  normalizePaymentMethodsInput,
  paymentMethodsFingerprint,
  type InvoicePaymentMethods,
} from "@/lib/invoice-payment-methods";
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

  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId: { in: organizationIds },
      OR: [
        { paymentBankName: { not: null } },
        { paymentAccountName: { not: null } },
        { paymentAccountNumber: { not: null } },
        { paymentSwiftCode: { not: null } },
        { paymentOtherMethods: { not: null } },
      ],
    },
    select: {
      ...invoicePaymentMethodSelect,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  const seen = new Set<string>();
  const templates: Array<InvoicePaymentMethods & { label: string }> = [];

  for (const invoice of invoices) {
    const methods: InvoicePaymentMethods = {
      paymentBankName: invoice.paymentBankName,
      paymentAccountName: invoice.paymentAccountName,
      paymentAccountNumber: invoice.paymentAccountNumber,
      paymentSwiftCode: invoice.paymentSwiftCode,
      paymentOtherMethods: invoice.paymentOtherMethods,
    };
    if (!hasAnyPaymentMethod(methods)) continue;

    const fingerprint = paymentMethodsFingerprint(methods);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);

    const labelParts = [
      methods.paymentBankName,
      methods.paymentAccountNumber ? `••••${methods.paymentAccountNumber.slice(-4)}` : null,
      methods.paymentSwiftCode,
    ].filter(Boolean);

    templates.push({
      ...methods,
      label: labelParts.join(" · ") || "Saved payment details",
    });
  }

  return NextResponse.json({ templates }, { status: 200 });
}
