import type { RequestHandler } from "./$types";
import { apiOk, authedApiContext, parseJsonBody } from "$lib/server/api";
import { clientCreateSchema, createClient, listClients } from "$lib/server/clients";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const rows = await listClients(ctx.db, ctx.userId);
  return apiOk({ clients: rows });
};

export const POST: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const input = await parseJsonBody(event.request, clientCreateSchema);
  const row = await createClient(ctx.db, ctx.userId, input);
  return apiOk({ client: row }, { status: 201 });
};
