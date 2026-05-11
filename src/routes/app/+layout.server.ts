import { requireSession } from "$lib/server/guards";
import { makeDb } from "$lib/server/db/client";
import { getSubscription, hasProEntitlement } from "$lib/server/entitlements";
import type { LayoutServerLoad } from "./$types";

export const prerender = false;

export const load: LayoutServerLoad = async (event) => {
  const session = await requireSession(event);
  let isPro = false;
  const d1 = event.platform?.env?.DB;
  if (d1) {
    const userId = (session.user as { id?: string }).id;
    if (userId) {
      const sub = await getSubscription(makeDb(d1), userId);
      isPro = hasProEntitlement(sub);
    }
  }
  return { session, isPro };
};
