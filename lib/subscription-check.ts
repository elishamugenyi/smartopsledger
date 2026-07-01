/**
 * Stripe mirror subscription checks using only `stripe.subscriptions` and
 * `stripe.customers` (plus app `"User"` to tie the logged-in account to customer email).
 * Used from `lib/access-control.ts` (cached path).
 */

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const GRACE_SECONDS = 86400; // 24h after period end (renewal lag / clock skew)

/**
 * True when there is an active/trialing subscription in the mirror whose customer
 * row has the same email as this app user (`userId`). Flow: subscriptions → customers
 * → email match on `"User"`.
 */
export async function checkStripeMirrorSubscriptionForUser(
  userId: string,
): Promise<boolean> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const threshold = now - GRACE_SECONDS;
    const rows = await prisma.$queryRaw<Array<{ ok: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM stripe.subscriptions s
        INNER JOIN stripe.customers c ON c.id = s.customer
        INNER JOIN "User" u ON u.id = ${userId}
          AND LOWER(TRIM(COALESCE(u.email, ''))) = LOWER(TRIM(COALESCE(c.email, '')))
        WHERE s.status IN ('active', 'trialing')
          AND COALESCE(s.current_period_end, 0) > ${threshold}
      ) AS ok
    `;
    return rows[0]?.ok ?? false;
  } catch (error) {
    console.error("Stripe mirror subscription check failed:", error);
    return false;
  }
}

const getCachedMirrorSubscription = unstable_cache(
  async (userId: string) => checkStripeMirrorSubscriptionForUser(userId),
  ["stripe-mirror-subscription"],
  { revalidate: 300 },
);

/** Cached subscriptions/customers mirror check (5 min). Server-only. */
export function hasActiveMirrorSubscriptionForUserCached(userId: string) {
  return getCachedMirrorSubscription(userId);
}

/** Organization billing: same mirror rules for the org owner’s user id. */
export async function orgHasActiveMirrorSubscriptionCached(
  organizationId: string,
): Promise<boolean> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { ownerId: true },
  });
  if (!org) return false;
  return hasActiveMirrorSubscriptionForUserCached(org.ownerId);
}
