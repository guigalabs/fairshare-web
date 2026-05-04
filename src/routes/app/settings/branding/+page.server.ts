import { authedApiContext } from "$lib/server/api";
import { getBranding } from "$lib/server/branding";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const branding = await getBranding(ctx.db, ctx.userId);
  return { branding };
};
