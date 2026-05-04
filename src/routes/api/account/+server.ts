import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { apiOk, authedApiContext } from "$lib/server/api";
import { subscriptions, users } from "$lib/server/db/schema";
import { stripeRequest } from "$lib/server/stripe";

export const prerender = false;

/**
 * Hard-delete the authenticated user. Cascades to accounts, sessions,
 * cases, clients, firm_branding, and subscriptions via the user_id
 * ON DELETE CASCADE foreign keys. The auth cookie is invalidated
 * separately by the client redirecting to /auth/signout.
 *
 * Before the cascade we cancel the user's Stripe subscription with
 * cancel_at_period_end=true so they keep Pro through the period they
 * already paid for, then no further charges. We skip Stripe for rows
 * created via scripts/pro.ts (stripe_subscription_id starts with
 * 'manual_') since those don't correspond to a real Stripe object.
 *
 * v1 deletes immediately; the 30-day soft-delete grace period is a
 * Phase 2 follow-up.
 */
export const DELETE: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);

  const [sub] = await ctx.db
    .select({ stripeSubscriptionId: subscriptions.stripeSubscriptionId })
    .from(subscriptions)
    .where(eq(subscriptions.userId, ctx.userId))
    .limit(1);

  const stripeSubId = sub?.stripeSubscriptionId;
  const isManual = stripeSubId?.startsWith("manual_") ?? true;
  const apiKey = event.platform?.env?.STRIPE_SECRET_KEY;

  if (stripeSubId && !isManual && apiKey) {
    const res = await stripeRequest({
      method: "POST",
      path: `/subscriptions/${stripeSubId}`,
      apiKey,
      body: { cancel_at_period_end: "true" },
    });
    if (!res.ok && res.status !== 404) {
      // 404 means the subscription was already gone at Stripe, which is
      // fine. Any other error is non-recoverable here — the user has
      // asked to delete their account, and we shouldn't block on Stripe.
      // Log and proceed; manual reconciliation if it matters.
      console.error("stripe cancel-at-period-end failed", res.status, await res.text());
    }
  }

  await ctx.db.delete(users).where(eq(users.id, ctx.userId));
  return apiOk({ ok: true });
};
