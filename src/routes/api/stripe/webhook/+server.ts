import { error, type RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { makeDb } from "$lib/server/db/client";
import {
  applySubscriptionEvent,
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

  let parsed: { type: string; data: { object: { id: string } } };
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw error(400, "invalid_json");
  }

  if (SUBSCRIPTION_EVENT_TYPES.has(parsed.type)) {
    const db = makeDb(env.DATABASE_URL);
    await applySubscriptionEvent(db, parsed as Parameters<typeof applySubscriptionEvent>[1]);
  }

  return json({ ok: true });
};
