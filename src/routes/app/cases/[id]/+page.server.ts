import { error } from "@sveltejs/kit";
import { authedApiContext } from "$lib/server/api";
import { getCase } from "$lib/server/cases";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const row = await getCase(ctx.db, ctx.userId, event.params.id);
  if (!row) throw error(404, "Case not found");
  return { case: row };
};
