import { eq } from "drizzle-orm";
import type { DB } from "./db/client";
import { processedWebhookEvents, subscriptions } from "./db/schema";

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

interface StripeSubscriptionItem {
  // `2025-03-31.basil` moved current_period_{start,end} from the
  // subscription onto the item. Older API versions still expose them
  // on the subscription itself, so we read both and prefer the item.
  current_period_end?: number;
  plan: { interval: "month" | "year" };
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  /** Pre-`basil` location. Kept for safety on older API versions. */
  current_period_end?: number;
  items: { data: StripeSubscriptionItem[] };
  metadata?: { user_id?: string };
}

interface StripeWebhook {
  /** `evt_*` — unique per delivered event. Used for idempotency. */
  id: string;
  /** Unix seconds the event was created at Stripe. Used to drop stale replays. */
  created: number;
  type: string;
  data: { object: StripeSubscription };
}

/**
 * Mark a Stripe `event.id` as processed. Returns `true` if this is the
 * first time we've seen it (caller should run the side effect), `false`
 * if Stripe already redelivered an event we've already handled.
 *
 * The PK on `processed_webhook_event.id` makes the INSERT atomic across
 * concurrent webhook deliveries. Postgres' ON CONFLICT DO NOTHING returns
 * the inserted row if it was new, nothing if the row already existed.
 */
export async function markEventProcessed(
  db: DB,
  event: { id: string; type: string },
): Promise<boolean> {
  const inserted = await db
    .insert(processedWebhookEvents)
    .values({ id: event.id, type: event.type })
    .onConflictDoNothing({ target: processedWebhookEvents.id })
    .returning({ id: processedWebhookEvents.id });
  return inserted.length > 0;
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
 * Out-of-order delivery: Stripe doesn't guarantee strict ordering, so a
 * delayed `subscription.deleted` for an old subscription can arrive
 * after a fresh `subscription.created` for a re-subscribing user. We
 * stamp `lastEventAt` from `event.created` and refuse to overwrite a
 * row whose stored `lastEventAt` is newer.
 *
 * 'customer.subscription.deleted' arrives with status 'canceled', so the
 * single upsert path handles it; entitlements.ts decides what status
 * means "still has Pro".
 */
export async function applySubscriptionEvent(db: DB, event: StripeWebhook): Promise<void> {
  const sub = event.data.object;
  const userId = sub.metadata?.user_id;
  if (!userId) return;

  const firstItem = sub.items.data[0];
  const cadence = firstItem?.plan.interval === "year" ? "annual" : "monthly";
  // basil API moved the period end onto the item; older versions kept it on the
  // subscription. Read item first, fall back to the subscription field.
  const periodEndUnix = firstItem?.current_period_end ?? sub.current_period_end;
  const currentPeriodEnd =
    typeof periodEndUnix === "number" ? new Date(periodEndUnix * 1000) : null;

  const values = {
    userId,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: sub.customer,
    plan: "pro" as const,
    cadence,
    status: sub.status,
    currentPeriodEnd,
    lastEventAt: event.created,
    updatedAt: new Date(),
  };

  const [existing] = await db
    .select({ id: subscriptions.id, lastEventAt: subscriptions.lastEventAt })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing) {
    // Drop replays / out-of-order deliveries that would overwrite a
    // newer state with an older one.
    if (existing.lastEventAt !== null && existing.lastEventAt >= event.created) return;
    await db.update(subscriptions).set(values).where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values(values);
  }
}
