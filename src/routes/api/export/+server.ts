import type { RequestHandler } from "./$types";
import { authedApiContext } from "$lib/server/api";
import { listCases } from "$lib/server/cases";
import { listClients } from "$lib/server/clients";
import { getBranding } from "$lib/server/branding";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const [clients, cases, branding] = await Promise.all([
    listClients(ctx.db, ctx.userId),
    listCases(ctx.db, ctx.userId),
    getBranding(ctx.db, ctx.userId),
  ]);
  const payload = {
    exportedAt: new Date().toISOString(),
    user: { id: ctx.userId, email: ctx.email },
    clients,
    cases,
    branding,
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="fairshare-export-${ctx.userId}.json"`,
    },
  });
};
