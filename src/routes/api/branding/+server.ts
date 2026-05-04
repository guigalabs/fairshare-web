import type { RequestHandler } from "./$types";
import { apiOk, authedApiContext, parseJsonBody } from "$lib/server/api";
import { brandingPutSchema, getBranding, upsertBranding } from "$lib/server/branding";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const row = await getBranding(ctx.db, ctx.userId);
  return apiOk({ branding: row });
};

export const PUT: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const input = await parseJsonBody(event.request, brandingPutSchema);
  const row = await upsertBranding(ctx.db, ctx.userId, input);
  return apiOk({ branding: row });
};
