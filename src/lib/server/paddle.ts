import { eq } from "drizzle-orm";
import type { DB } from "./db/client";
import { subscriptions } from "./db/schema";

/**
 * Verify a Paddle Billing webhook signature.
 *
 * Paddle sends a `Paddle-Signature` header with the format
 *   ts=<unix>;h1=<hex-hmac-sha256>
 * where the HMAC body is `${timestamp}:${rawBodyAsString}` and the key is
 * the webhook secret configured in the Paddle dashboard.
 *
 * Pure: no fetch / DB. Tests cover this directly.
 */
export async function verifyPaddleSignature(args: {
  rawBody: string;
  signatureHeader: string;
  secret: string;
  toleranceSeconds?: number;
  now?: Date;
}): Promise<boolean> {
  const tolerance = args.toleranceSeconds ?? 300;
  const now = args.now ?? new Date();

  const parts = Object.fromEntries(
    args.signatureHeader.split(";").map((kv) => {
      const [k, v] = kv.split("=", 2);
      return [k?.trim() ?? "", v?.trim() ?? ""];
    }),
  );
  const ts = parts.ts;
  const expected = parts.h1;
  if (!ts || !expected) return false;

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  if (Math.abs(now.getTime() / 1000 - tsNum) > tolerance) return false;

  const body = `${ts}:${args.rawBody}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(args.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body)));
  const sigHex = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return constantTimeEqual(sigHex, expected);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

interface PaddleSubscriptionData {
  id: string;
  customer_id?: string;
  status: string;
  current_billing_period?: { ends_at?: string };
  billing_cycle?: { interval?: string };
  custom_data?: { user_id?: string };
}

interface PaddleWebhook {
  event_type: string;
  data: PaddleSubscriptionData;
}

/**
 * Upsert a Paddle subscription event into our `subscriptions` table.
 * The Paddle status names map directly: 'active' | 'past_due' | 'canceled'
 * | 'trialing'. Cadence comes from `billing_cycle.interval` ('month' or
 * 'year'). The user_id is carried in `custom_data.user_id` — we set it
 * when starting the checkout session.
 */
export async function applySubscriptionEvent(db: DB, event: PaddleWebhook): Promise<void> {
  const data = event.data;
  const userId = data.custom_data?.user_id;
  if (!userId) return;

  const cadence = data.billing_cycle?.interval === "year" ? "annual" : "monthly";
  const currentPeriodEnd = data.current_billing_period?.ends_at
    ? new Date(data.current_billing_period.ends_at)
    : null;

  const values = {
    userId,
    paddleSubscriptionId: data.id,
    paddleCustomerId: data.customer_id ?? null,
    plan: "pro" as const,
    cadence,
    status: data.status,
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
