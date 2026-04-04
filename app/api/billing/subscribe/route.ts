import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type SubscribeBody = {
  priceId?: string;
};

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as SubscribeBody | null;
  const priceId = body?.priceId?.trim();
  if (!priceId) {
    return NextResponse.json({ error: "PRICE_ID_REQUIRED" }, { status: 400 });
  }

  // Stripe will be connected later. For now we:
  // - Ensure a customer id placeholder exists
  // - Mark subscription status as "incomplete"
  // - Return a predictable payload you can swap to Stripe Checkout later
  const stripeCustomerId =
    auth.user.stripeCustomerId ??
    `cus_pending_${crypto.randomBytes(12).toString("hex")}`;

  await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      stripeCustomerId,
      subscriptionStatus: "incomplete",
    },
  });

  return NextResponse.json(
    {
      ok: true,
      stripe: {
        mode: "checkout_stub",
        priceId,
        customerId: stripeCustomerId,
        checkoutUrl: null as string | null,
      },
    },
    { status: 200 },
  );
}

