import { authedApiContext } from "$lib/server/api";
import { getSubscription, hasProEntitlement } from "$lib/server/entitlements";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const sub = await getSubscription(ctx.db, ctx.userId);
  return {
    subscription: sub,
    isPro: hasProEntitlement(sub),
  };
};
