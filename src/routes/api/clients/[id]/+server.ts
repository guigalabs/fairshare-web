import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { apiOk, authedApiContext, parseJsonBody } from "$lib/server/api";
import { clientPatchSchema, getClient, patchClient, softDeleteClient } from "$lib/server/clients";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const row = await getClient(ctx.db, ctx.userId, event.params.id);
  if (!row) throw error(404, "not_found");
  return apiOk({ client: row });
};

export const PATCH: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const patch = await parseJsonBody(event.request, clientPatchSchema);
  const row = await patchClient(ctx.db, ctx.userId, event.params.id, patch);
  if (!row) throw error(404, "not_found");
  return apiOk({ client: row });
};

export const DELETE: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const ok = await softDeleteClient(ctx.db, ctx.userId, event.params.id);
  if (!ok) throw error(404, "not_found");
  return apiOk({ ok: true });
};
