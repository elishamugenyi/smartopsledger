import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  databaseUnavailableResponse,
  isDatabaseConnectionError,
  withDatabaseRetry,
} from "@/lib/db-connection-error";
import {
  hasAnyPaymentMethod,
  invoicePaymentMethodSelect,
} from "@/lib/invoice-payment-methods";
import { getInvoiceStatusTotals } from "@/lib/invoice-list";
import { prisma } from "@/lib/prisma";
import { getUserTenantContext } from "@/lib/tenant-access";

type CreateInvoiceBody = {
  clientName?: string;
  clientEmail?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
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
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize") || 10), 1),
    50,
  );
  const status = searchParams.get("status")?.trim().toUpperCase();
  const search = searchParams.get("search")?.trim();

  const where = {
    organizationId: { in: organizationIds },
    ...(status &&
    ["DRAFT", "SENT", "VIEWED", "PAID", "OVERDUE", "CANCELLED"].includes(status)
      ? { status: status as "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED" }
      : {}),
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
  };

  try {
    const invoices = await withDatabaseRetry(() =>
      prisma.invoice.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
            },
          },
          items: {
            select: {
              id: true,
              description: true,
              quantity: true,
              unitPrice: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    );

    const [total, totals] = await Promise.all([
      withDatabaseRetry(() => prisma.invoice.count({ where })),
      getInvoiceStatusTotals(organizationIds),
    ]);

    return NextResponse.json(
      {
        invoices,
        totals,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.max(Math.ceil(total / pageSize), 1),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return databaseUnavailableResponse();
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as CreateInvoiceBody | null;
  const clientName = body?.clientName?.trim();
  const clientEmail = body?.clientEmail?.trim().toLowerCase();
  const amount = body?.amount;
  const description = body?.description?.trim();

  if (!clientName) {
    return NextResponse.json({ error: "CLIENT_NAME_REQUIRED" }, { status: 400 });
  }
  if (!clientEmail) {
    return NextResponse.json({ error: "CLIENT_EMAIL_REQUIRED" }, { status: 400 });
  }
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "VALID_AMOUNT_REQUIRED" }, { status: 400 });
  }

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
  const amountInCents = Math.round(amount * 100);

  const existingClient = await prisma.client.findFirst({
    where: {
      organizationId: { in: organizationIds },
      email: clientEmail,
    },
    select: { id: true },
  });

  const client = existingClient
    ? await prisma.client.update({
        where: { id: existingClient.id },
        data: { name: clientName },
        select: { id: true },
      })
    : await prisma.client.create({
        data: {
          organizationId: primaryOrganizationId,
          name: clientName,
          email: clientEmail,
        },
        select: { id: true },
      });

  const lastPaymentMethods = await prisma.invoice.findFirst({
    where: {
      organizationId: primaryOrganizationId,
      OR: [
        { paymentBankName: { not: null } },
        { paymentAccountName: { not: null } },
        { paymentAccountNumber: { not: null } },
        { paymentSwiftCode: { not: null } },
        { paymentOtherMethods: { not: null } },
      ],
    },
    select: invoicePaymentMethodSelect,
    orderBy: { updatedAt: "desc" },
  });

  const paymentPrefill =
    lastPaymentMethods && hasAnyPaymentMethod(lastPaymentMethods)
      ? lastPaymentMethods
      : {};

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: primaryOrganizationId,
      clientId: client.id,
      amount: amountInCents,
      currency: body?.currency?.trim().toLowerCase() || "usd",
      status: "DRAFT",
      dueDate: body?.dueDate ? new Date(body.dueDate) : null,
      ...paymentPrefill,
      items: description
        ? {
            create: {
              description,
              quantity: 1,
              unitPrice: amountInCents,
            },
          }
        : undefined,
    },
    include: {
      client: {
        select: {
          name: true,
          email: true,
        },
      },
      items: true,
    },
  });

  return NextResponse.json({ invoice }, { status: 201 });
}
