import { Billing } from "usebilling";
import billingConfig from "../billing.config";
import type { Stripe } from "stripe";
import { prisma } from "@/lib/prisma";

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

async function getMappedUserIdForCustomer(customerId: string): Promise<string | null> {
  const mappingTableCandidates = [
    "stripe.user_stripe_customers_map",
    "stripe.user_stripe_customer_map",
  ] as const;

  for (const tableName of mappingTableCandidates) {
    try {
      const rows = await prisma.$queryRawUnsafe<Array<{ user_id: string }>>(
        `SELECT user_id FROM ${tableName} WHERE stripe_customer_id = $1 LIMIT 1`,
        customerId,
      );
      if (rows.length > 0) return rows[0].user_id;
    } catch {
      // Table may not exist in this environment.
    }
  }

  return null;
}

async function updateUserSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return;

  const updateResult = await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: { subscriptionStatus: subscription.status },
  });

  if (updateResult.count > 0) return;

  // Fallback to usebilling's mapping table when local stripeCustomerId is not set.
  const mappedUserId = await getMappedUserIdForCustomer(customerId);
  if (!mappedUserId) return;

  await prisma.user.update({
    where: { id: mappedUserId },
    data: {
      stripeCustomerId: customerId,
      subscriptionStatus: subscription.status,
    },
  });
}

// Initialize once, use everywhere (for credits/subscriptions API access)
// If you only need the webhook handler, you can skip this file and use
// createHandler() directly in your API route.
export const billing = new Billing({
  billingConfig,
  // Keys and database URL are read from environment variables by default:
  // - STRIPE_SECRET_KEY
  // - STRIPE_WEBHOOK_SECRET
  // - DATABASE_URL

  // OPTIONAL: Add callbacks for subscription/credit events
  callbacks: {
    // Fired when Stripe marks a subscription created/active.
    onSubscriptionCreated: async (subscription: Stripe.Subscription) => {
      await updateUserSubscriptionStatus(subscription);
      console.log("Subscription created/activated:", subscription.id);
    },

    onSubscriptionCancelled: async (subscription: Stripe.Subscription) => {
      await updateUserSubscriptionStatus(subscription);
      console.log("Subscription cancelled:", subscription.id);
    },

    onSubscriptionRenewed: async (subscription: Stripe.Subscription) => {
      await updateUserSubscriptionStatus(subscription);
      console.log("Subscription renewed:", subscription.id);
    },

    onSubscriptionPlanChanged: async (subscription: Stripe.Subscription) => {
      await updateUserSubscriptionStatus(subscription);
      console.log("Subscription plan changed:", subscription.id);
    },
  },
});
