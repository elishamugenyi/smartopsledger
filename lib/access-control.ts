import { prisma } from "@/lib/prisma";

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

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
    },
  });

  if (!user) return false;

  return ACTIVE_SUBSCRIPTION_STATUSES.has(
    normalizeStatus(user.subscriptionStatus),
  );
}

async function hasOrganizationOwnerSubscription(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: {
      organization: {
        select: {
          owner: {
            select: {
              subscriptionStatus: true,
            },
          },
        },
      },
    },
  });

  return memberships.some((membership) =>
    ACTIVE_SUBSCRIPTION_STATUSES.has(
      normalizeStatus(membership.organization.owner.subscriptionStatus),
    ),
  );
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
  const hasOwnerSubscription = await hasOrganizationOwnerSubscription(userId);
  const hasSubscription = hasOwnSubscription || hasOwnerSubscription;
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

