import { authedApiContext } from "$lib/server/api";
import { listClients } from "$lib/server/clients";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const clients = await listClients(ctx.db, ctx.userId);
  return { clients };
};
