import { prisma } from "@/lib/prisma";
import { hasActiveMirrorSubscriptionForUserCached } from "@/lib/subscription-check";

const TRIAL_PERIOD_DAYS = 3;
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export type DashboardAccessState = {
  hasActiveSubscription: boolean;
  isTrialActive: boolean;
  trialEndsAt: Date;
  trialDaysRemaining: number;
  isLocked: boolean;
};

function normalizeStatus(status: string | null | undefined) {
  return (status ?? "").toLowerCase();
}

function calculateTrialInfo(createdAt: Date) {
  const trialEndsAt = new Date(
    createdAt.getTime() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000,
  );
  const millisRemaining = trialEndsAt.getTime() - Date.now();
  const isTrialActive = millisRemaining > 0;
  const trialDaysRemaining = isTrialActive
    ? Math.ceil(millisRemaining / (24 * 60 * 60 * 1000))
    : 0;

  return {
    trialEndsAt,
    isTrialActive,
    trialDaysRemaining,
  };
}

async function hasStripeActiveSubscription(userId: string): Promise<boolean> {
  return hasActiveMirrorSubscriptionForUserCached(userId);
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
    },
  });

  if (!user) return false;

  const hasLocalStatus = ACTIVE_SUBSCRIPTION_STATUSES.has(
    normalizeStatus(user.subscriptionStatus),
  );
  if (hasLocalStatus) return true;

  return hasStripeActiveSubscription(userId);
}

async function hasOrganizationOwnerSubscription(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: {
      organization: {
        select: {
          owner: {
            select: {
              id: true,
              subscriptionStatus: true,
            },
          },
        },
      },
    },
  });

  for (const membership of memberships) {
    const ownerHasLocalStatus = ACTIVE_SUBSCRIPTION_STATUSES.has(
      normalizeStatus(membership.organization.owner.subscriptionStatus),
    );
    if (ownerHasLocalStatus) return true;

    if (await hasStripeActiveSubscription(membership.organization.owner.id)) {
      return true;
    }
  }

  return false;
}

export async function getDashboardAccessStateByUserId(
  userId: string,
): Promise<DashboardAccessState | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      createdAt: true,
      subscriptionStatus: true,
    },
  });

  if (!user) return null;

  const hasOwnSubscription = ACTIVE_SUBSCRIPTION_STATUSES.has(
    normalizeStatus(user.subscriptionStatus),
  );
  const hasOwnStripeSubscription = hasOwnSubscription
    ? true
    : await hasStripeActiveSubscription(userId);
  const hasOwnerSubscription = await hasOrganizationOwnerSubscription(userId);
  const hasSubscription = hasOwnStripeSubscription || hasOwnerSubscription;
  const trialInfo = calculateTrialInfo(user.createdAt);

  return {
    hasActiveSubscription: hasSubscription,
    isTrialActive: trialInfo.isTrialActive,
    trialEndsAt: trialInfo.trialEndsAt,
    trialDaysRemaining: trialInfo.trialDaysRemaining,
    isLocked: !hasSubscription && !trialInfo.isTrialActive,
  };
}

export async function getDashboardAccessStateByStripeCustomerId(
  stripeCustomerId: string,
): Promise<DashboardAccessState | null> {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId },
    select: {
      id: true,
    },
  });

  if (!user) return null;
  return getDashboardAccessStateByUserId(user.id);
}

