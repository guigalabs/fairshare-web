import { error, type RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { makeDb } from "$lib/server/db/client";
import {
  applySubscriptionEvent,
  markEventProcessed,
  SUBSCRIPTION_EVENT_TYPES,
  verifyStripeSignature,
} from "$lib/server/stripe";

export const prerender = false;

export const POST: RequestHandler = async ({ request, platform }) => {
  const env = platform?.env;
  if (!env) throw error(500, "platform_unavailable");
  if (!env.STRIPE_WEBHOOK_SECRET) throw error(500, "webhook_secret_missing");

  const sigHeader = request.headers.get("stripe-signature");
  if (!sigHeader) throw error(400, "signature_missing");

  const rawBody = await request.text();
  const ok = await verifyStripeSignature({
    rawBody,
    signatureHeader: sigHeader,
    secret: env.STRIPE_WEBHOOK_SECRET,
  });
  if (!ok) throw error(401, "signature_invalid");

  let parsed: { id: string; type: string; created: number; data: { object: { id: string } } };
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw error(400, "invalid_json");
  }

  if (!parsed.id || !parsed.type) throw error(400, "invalid_event");

  const db = makeDb(env.DATABASE_URL);

  // Apply BEFORE marking the event processed. applySubscriptionEvent is
  // idempotent (its `lastEventAt >= event.created` guard short-circuits
  // a replayed event), so a transient failure here just means Stripe
  // retries and the next attempt converges. If we marked first and the
  // apply threw, Stripe's retry would dedup against the marker, return
  // 200, and the subscription state would be permanently lost.
  //
  // Marking is also gated on the event type so non-subscription events
  // don't pollute the dedup table.
  if (SUBSCRIPTION_EVENT_TYPES.has(parsed.type)) {
    await applySubscriptionEvent(db, parsed as Parameters<typeof applySubscriptionEvent>[1]);
    await markEventProcessed(db, { id: parsed.id, type: parsed.type });
  }

  return json({ ok: true });
};
