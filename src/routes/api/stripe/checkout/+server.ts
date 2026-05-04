import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { authedApiContext } from "$lib/server/api";
import { stripeRequest } from "$lib/server/stripe";

export const prerender = false;

/**
 * Create a Managed Payments Checkout session for the FairShare Pro plan
 * and 303-redirect the visitor to the hosted Stripe checkout URL.
 *
 * MP forbids `payment_method_types`, `automatic_tax`, `tax_id_collection`,
 * `subscription_data.default_tax_rates`, and `subscription_data.invoice_settings`
 * — Stripe handles all of those itself when MP is enabled. The session
 * carries `subscription_data[metadata][user_id]` so the eventual
 * `customer.subscription.created` webhook can bind back to our user row.
 *
 * Form fields: cadence=monthly|annual.
 */
export const POST: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const env = event.platform?.env;
  if (!env?.STRIPE_SECRET_KEY) throw error(500, "stripe_not_configured");

  const form = await event.request.formData();
  const cadence = form.get("cadence") === "annual" ? "annual" : "monthly";
  const priceId = cadence === "annual" ? env.STRIPE_PRICE_ID_ANNUAL : env.STRIPE_PRICE_ID_MONTHLY;
  if (!priceId) throw error(500, "price_not_configured");

  const origin = event.url.origin;
  const body: Record<string, string> = {
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "managed_payments[enabled]": "true",
    mode: "subscription",
    success_url: `${origin}/app/cases?welcome=1`,
    cancel_url: `${origin}/pricing`,
    customer_email: ctx.email,
    "subscription_data[metadata][user_id]": ctx.userId,
    "metadata[user_id]": ctx.userId,
    client_reference_id: ctx.userId,
  };

  const res = await stripeRequest({
    method: "POST",
    path: "/checkout/sessions",
    apiKey: env.STRIPE_SECRET_KEY,
    body,
    idempotencyKey: `checkout-${ctx.userId}-${cadence}-${Math.floor(Date.now() / 1000 / 60)}`,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("stripe checkout create failed", res.status, text);
    throw error(502, "stripe_checkout_failed");
  }
  const session = (await res.json()) as { url: string };
  throw redirect(303, session.url);
};
