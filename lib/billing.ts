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

async function updateUserSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return;

  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: { subscriptionStatus: subscription.status },
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
