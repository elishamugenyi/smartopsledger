import { NextResponse, type NextRequest } from "next/server";
import { appPath } from "@/lib/app-url";
import { requireUser } from "@/lib/auth";
import { sendInvoiceEmail } from "@/lib/invoice-email";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  calculatePlatformFeeCents,
  formatConnectNotReadyHint,
  formatInvoiceLineDescription,
  resolveOrganizationConnectState,
} from "@/lib/stripe-connect";
import { getUserTenantContext } from "@/lib/tenant-access";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ invoiceId: string }> },
) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "STRIPE_NOT_CONFIGURED" }, { status: 503 });
  }

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { invoiceId } = await context.params;
  const { organizationIds } = await getUserTenantContext(auth.user.id);

  if (organizationIds.length === 0) {
    return NextResponse.json({ error: "ORGANIZATION_REQUIRED" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId: { in: organizationIds } },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "INVOICE_NOT_FOUND" }, { status: 404 });
  }

  if (invoice.status === "PAID") {
    return NextResponse.json({ error: "INVOICE_ALREADY_PAID" }, { status: 400 });
  }

  if (invoice.status === "CANCELLED") {
    return NextResponse.json({ error: "INVOICE_CANCELLED" }, { status: 400 });
  }

  const organization = await resolveOrganizationConnectState(invoice.organizationId);
  if (!organization) {
    return NextResponse.json({ error: "ORGANIZATION_NOT_FOUND" }, { status: 404 });
  }

  const connectAccountId = organization.stripeConnectAccountId;
  if (!connectAccountId) {
    return NextResponse.json(
      {
        error: "STRIPE_CONNECT_REQUIRED",
        hint: "Connect a Stripe account in Settings before sending payable invoices.",
      },
      { status: 400 },
    );
  }

  if (!organization.stripeConnectChargesEnabled) {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(connectAccountId);
    return NextResponse.json(
      {
        error: "STRIPE_CONNECT_NOT_READY",
        hint: formatConnectNotReadyHint(account),
      },
      { status: 400 },
    );
  }

  if (!invoice.client.email) {
    return NextResponse.json({ error: "CLIENT_EMAIL_REQUIRED" }, { status: 400 });
  }

  const stripe = getStripe();
  const applicationFeeAmount = calculatePlatformFeeCents(invoice.amount);
  const lineDescription = formatInvoiceLineDescription(invoice.items);
  const paymentSuccessUrl = appPath(
    `/payment-success?invoiceId=${encodeURIComponent(invoice.id)}`,
  );

  let paymentLinkUrl = invoice.stripePaymentLinkUrl;
  let paymentLinkId = invoice.stripePaymentLinkId;

  if (!paymentLinkUrl || !paymentLinkId) {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: invoice.currency,
            unit_amount: invoice.amount,
            product_data: {
              name: `Invoice ${invoice.id.slice(-8).toUpperCase()}`,
              description: lineDescription,
            },
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: { url: paymentSuccessUrl },
      },
      metadata: {
        invoiceId: invoice.id,
        organizationId: invoice.organizationId,
      },
      transfer_data: {
        destination: connectAccountId,
      },
      application_fee_amount: applicationFeeAmount,
    });

    paymentLinkUrl = paymentLink.url;
    paymentLinkId = paymentLink.id;
  }

  const amountFormatted = `$${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`;
  const emailResult = await sendInvoiceEmail({
    toEmail: invoice.client.email,
    clientName: invoice.client.name,
    organizationName: organization.name,
    invoiceId: invoice.id,
    amountFormatted,
    dueDate: invoice.dueDate
      ? invoice.dueDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,
    paymentLink: paymentLinkUrl,
  });

  const updated = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: "SENT",
      sentAt: invoice.sentAt ?? new Date(),
      stripePaymentLinkId: paymentLinkId,
      stripePaymentLinkUrl: paymentLinkUrl,
    },
    include: {
      client: { select: { name: true, email: true } },
    },
  });

  await prisma.event.create({
    data: {
      organizationId: invoice.organizationId,
      type: "INVOICE_SENT",
      payload: {
        invoiceId: invoice.id,
        paymentLinkId,
        applicationFeeAmount,
      },
    },
  });

  return NextResponse.json(
    {
      invoice: updated,
      paymentLinkUrl,
      platformFeeCents: applicationFeeAmount,
      emailSent: emailResult.ok,
      emailError: emailResult.ok ? undefined : emailResult.message,
    },
    { status: 200 },
  );
}
