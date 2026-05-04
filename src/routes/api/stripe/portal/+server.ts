import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { authedApiContext } from "$lib/server/api";
import { getSubscription } from "$lib/server/entitlements";
import { stripeRequest } from "$lib/server/stripe";

export const prerender = false;

/**
 * Create a Stripe Billing customer-portal session and 303-redirect
 * the user to it. The customer must already exist (i.e. they've gone
 * through Checkout once); free users land back on /pricing.
 */
export const POST: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const sub = await getSubscription(ctx.db, ctx.userId);
  if (!sub?.stripeCustomerId) throw redirect(303, "/pricing");

  const env = event.platform?.env;
  if (!env?.STRIPE_SECRET_KEY) throw error(500, "stripe_not_configured");

  const res = await stripeRequest({
    method: "POST",
    path: "/billing_portal/sessions",
    apiKey: env.STRIPE_SECRET_KEY,
    body: {
      customer: sub.stripeCustomerId,
      return_url: `${event.url.origin}/app/settings/billing`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("stripe portal create failed", res.status, text);
    throw error(502, "stripe_portal_failed");
  }
  const session = (await res.json()) as { url: string };
  throw redirect(303, session.url);
};
