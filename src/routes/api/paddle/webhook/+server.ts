import { error, type RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { makeDb } from "$lib/server/db/client";
import { applySubscriptionEvent, verifyPaddleSignature } from "$lib/server/paddle";

export const prerender = false;

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.activated",
  "subscription.canceled",
  "subscription.past_due",
  "subscription.trialing",
]);

export const POST: RequestHandler = async ({ request, platform }) => {
  const env = platform?.env;
  if (!env) throw error(500, "platform_unavailable");
  const secret = (env as unknown as { PADDLE_WEBHOOK_SECRET?: string }).PADDLE_WEBHOOK_SECRET;
  if (!secret) throw error(500, "webhook_secret_missing");

  const sigHeader = request.headers.get("paddle-signature");
  if (!sigHeader) throw error(400, "signature_missing");

  const rawBody = await request.text();
  const ok = await verifyPaddleSignature({
    rawBody,
    signatureHeader: sigHeader,
    secret,
  });
  if (!ok) throw error(401, "signature_invalid");

  let parsed: { event_type: string; data: { id: string } } | null = null;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw error(400, "invalid_json");
  }
  if (!parsed) throw error(400, "invalid_json");

  if (SUBSCRIPTION_EVENTS.has(parsed.event_type)) {
    const db = makeDb(env.DATABASE_URL);
    await applySubscriptionEvent(db, parsed as Parameters<typeof applySubscriptionEvent>[1]);
  }

  return json({ ok: true });
};
