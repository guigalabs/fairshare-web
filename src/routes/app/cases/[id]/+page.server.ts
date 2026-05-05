import { error } from "@sveltejs/kit";
import { authedApiContext } from "$lib/server/api";
import { getBranding } from "$lib/server/branding";
import { getCase } from "$lib/server/cases";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const [row, branding] = await Promise.all([
    getCase(ctx.db, ctx.userId, event.params.id),
    getBranding(ctx.db, ctx.userId),
  ]);
  if (!row) throw error(404, "Case not found");
  return { case: row, branding };
};
