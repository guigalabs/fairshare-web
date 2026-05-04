import { error } from "@sveltejs/kit";
import { apiOk, authedApiContext, parseJsonBody } from "$lib/server/api";
import { casePatchSchema, getCase, patchCase, softDeleteCase } from "$lib/server/cases";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const row = await getCase(ctx.db, ctx.userId, event.params.id);
  if (!row) throw error(404, "not_found");
  return apiOk({ case: row });
};

export const PATCH: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const patch = await parseJsonBody(event.request, casePatchSchema);
  const row = await patchCase(ctx.db, ctx.userId, event.params.id, patch);
  if (!row) throw error(404, "not_found");
  return apiOk({ case: row });
};

export const DELETE: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const ok = await softDeleteCase(ctx.db, ctx.userId, event.params.id);
  if (!ok) throw error(404, "not_found");
  return apiOk({ ok: true });
};
