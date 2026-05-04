import { eq } from "drizzle-orm";
import type { DB } from "./db/client";
import { subscriptions } from "./db/schema";

/**
 * Pin every Stripe API call to the version that gates Managed Payments.
 * Older versions silently drop `managed_payments[enabled]=true`.
 */
export const STRIPE_API_VERSION = "2025-03-31.basil";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

/**
 * Verify a Stripe webhook signature.
 *
 * Header `Stripe-Signature` is comma-separated `t=<unix>,v1=<hex>,v0=<old>`.
 * The signed payload is `${t}.${rawBody}`, HMAC-SHA256 with the webhook
 * signing secret. Stripe rotates by appending v1 entries — we accept the
 * payload if any v1 matches.
 *
 * Pure: no fetch / DB. Tested directly.
 */
export async function verifyStripeSignature(args: {
  rawBody: string;
  signatureHeader: string;
  secret: string;
  toleranceSeconds?: number;
  now?: Date;
}): Promise<boolean> {
  const tolerance = args.toleranceSeconds ?? 300;
  const now = args.now ?? new Date();

  const parts = args.signatureHeader.split(",").map((kv) => {
    const [k, v] = kv.split("=", 2);
    return [k?.trim() ?? "", v?.trim() ?? ""] as const;
  });
  const tsStr = parts.find(([k]) => k === "t")?.[1];
  const v1s = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!tsStr || v1s.length === 0) return false;

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(now.getTime() / 1000 - ts) > tolerance) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(args.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(`${tsStr}.${args.rawBody}`)),
  );
  const expected = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return v1s.some((sig) => constantTimeEqual(sig, expected));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Make a Stripe API call with the right headers. Used by the checkout-
 * session and customer-portal endpoints. Form-encoded body (Stripe's API
 * is form-encoded, not JSON).
 */
export async function stripeRequest(args: {
  method: "POST" | "GET" | "DELETE";
  path: string;
  apiKey: string;
  body?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<Response> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${args.apiKey}`,
    "Stripe-Version": STRIPE_API_VERSION,
  };
  if (args.idempotencyKey) headers["Idempotency-Key"] = args.idempotencyKey;

  let body: string | undefined;
  if (args.body) {
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(args.body).toString();
  }

  return fetch(`${STRIPE_API_BASE}${args.path}`, {
    method: args.method,
    headers,
    body,
  });
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_end?: number;
  items: { data: Array<{ plan: { interval: "month" | "year" } }> };
  metadata?: { user_id?: string };
}

interface StripeWebhook {
  type: string;
  data: { object: StripeSubscription };
}

/** Subscription-lifecycle events we react to. */
export const SUBSCRIPTION_EVENT_TYPES = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
]);

/**
 * Upsert a Stripe subscription event into our `subscriptions` table.
 *
 * The user_id is carried in `metadata.user_id`, which we set on the
 * Checkout session as `subscription_data[metadata][user_id]` when the
 * Subscribe CTA fires. Stripe propagates that to the subscription.
 *
 * 'customer.subscription.deleted' arrives with status 'canceled', so the
 * single upsert path handles it; entitlements.ts decides what status
 * means "still has Pro".
 */
export async function applySubscriptionEvent(db: DB, event: StripeWebhook): Promise<void> {
  const sub = event.data.object;
  const userId = sub.metadata?.user_id;
  if (!userId) return;

  const cadence = sub.items.data[0]?.plan.interval === "year" ? "annual" : "monthly";
  const currentPeriodEnd =
    typeof sub.current_period_end === "number" ? new Date(sub.current_period_end * 1000) : null;

  const values = {
    userId,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: sub.customer,
    plan: "pro" as const,
    cadence,
    status: sub.status,
    currentPeriodEnd,
    updatedAt: new Date(),
  };

  const existing = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing[0]) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values(values);
  }
}
