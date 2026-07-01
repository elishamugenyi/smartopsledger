import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { organizationStripeConnectUpdateData } from "@/lib/organization-stripe-select";
import { syncOrganizationConnectStatus } from "@/lib/stripe-connect";

export const runtime = "nodejs";

async function markInvoicePaidFromSession(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoiceId;
  if (!invoiceId) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const existing = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { id: true, status: true, amount: true, organizationId: true },
  });

  if (!existing || existing.status === "PAID") return;

  await prisma.$transaction([
    prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId ?? undefined,
        stripeSessionId: session.id,
      },
    }),
    prisma.payment.create({
      data: {
        invoiceId,
        amount: existing.amount,
        status: "SUCCEEDED",
        stripePaymentIntentId: paymentIntentId ?? undefined,
      },
    }),
    prisma.event.create({
      data: {
        organizationId: existing.organizationId,
        type: "INVOICE_PAID",
        payload: {
          invoiceId,
          stripeSessionId: session.id,
          paymentIntentId,
        },
      },
    }),
  ]);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret =
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    return NextResponse.json({ error: "WEBHOOK_SECRET_NOT_CONFIGURED" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "MISSING_SIGNATURE" }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.invoiceId) {
          await markInvoicePaidFromSession(session);
        }
        break;
      }
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        const organizationId = account.metadata?.organizationId;
        if (organizationId) {
          await syncOrganizationConnectStatus(organizationId, account);
        } else {
          await prisma.organization.updateMany({
            where: { stripeConnectAccountId: account.id },
            data: organizationStripeConnectUpdateData(account),
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe Connect webhook handler error:", error);
    return NextResponse.json({ error: "WEBHOOK_HANDLER_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
