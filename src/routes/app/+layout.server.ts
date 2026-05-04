import { requireSession } from "$lib/server/guards";
import type { LayoutServerLoad } from "./$types";

export const prerender = false;

export const load: LayoutServerLoad = async (event) => {
  const session = await requireSession(event);
  return { session };
};
