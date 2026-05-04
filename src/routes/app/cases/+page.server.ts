import { authedApiContext } from "$lib/server/api";
import { listCases } from "$lib/server/cases";
import { listClients } from "$lib/server/clients";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async (event) => {
  const ctx = await authedApiContext(event);
  const url = event.url;
  const [cases, clients] = await Promise.all([
    listCases(ctx.db, ctx.userId, {
      search: url.searchParams.get("q") ?? undefined,
      clientId: url.searchParams.get("client_id") ?? undefined,
      madhhab:
        (url.searchParams.get("madhhab") as
          | "general"
          | "hanafi"
          | "maliki"
          | "shafii"
          | "hanbali"
          | null) ?? undefined,
      tag: url.searchParams.get("tag") ?? undefined,
    }),
    listClients(ctx.db, ctx.userId),
  ]);
  return { cases, clients, query: url.searchParams.get("q") ?? "" };
};
