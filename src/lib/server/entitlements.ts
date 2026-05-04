import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { DB } from "./db/client";
import { subscriptions } from "./db/schema";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface SubscriptionRow {
  status: string;
  currentPeriodEnd: Date | null;
  cadence?: string;
  plan?: string;
  stripeCustomerId?: string | null;
}

/**
 * A user has Pro right now iff:
 *  - status is 'active' (Stripe is happily billing them), OR
 *  - status is 'past_due' but the current period hasn't ended yet
 *    (give one billing cycle of grace), OR
 *  - status is 'canceled' but the cancellation hasn't taken effect yet.
 */
export function hasProEntitlement(
  sub: SubscriptionRow | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!sub) return false;
  if (sub.status === "active") return true;
  if (sub.status === "past_due" || sub.status === "canceled") {
    return sub.currentPeriodEnd !== null && sub.currentPeriodEnd > now;
  }
  return false;
}

export async function getSubscription(db: DB, userId: string): Promise<SubscriptionRow | null> {
  const rows = await db
    .select({
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      cadence: subscriptions.cadence,
      plan: subscriptions.plan,
      stripeCustomerId: subscriptions.stripeCustomerId,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Throws 402 (Payment Required) if the user is not on the Pro plan.
 * Use from within an authedApiContext-protected endpoint.
 */
export async function requireEntitlement(db: DB, userId: string): Promise<void> {
  const sub = await getSubscription(db, userId);
  if (!hasProEntitlement(sub)) throw error(402, "pro_required");
}
