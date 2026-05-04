import type { Madhhab } from "$engine";
import { apiOk, authedApiContext, parseJsonBody } from "$lib/server/api";
import { caseCreateSchema, createCase, listCases } from "$lib/server/cases";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const url = event.url;
  const rows = await listCases(ctx.db, ctx.userId, {
    search: url.searchParams.get("q") ?? undefined,
    clientId: url.searchParams.get("client_id") ?? undefined,
    folderId: url.searchParams.get("folder_id") ?? undefined,
    madhhab: (url.searchParams.get("madhhab") as Madhhab | null) ?? undefined,
    tag: url.searchParams.get("tag") ?? undefined,
    sort: url.searchParams.get("sort") === "updated_asc" ? "updated_asc" : "updated_desc",
  });
  return apiOk({ cases: rows });
};

export const POST: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  const input = await parseJsonBody(event.request, caseCreateSchema);
  const row = await createCase(ctx.db, ctx.userId, input);
  return apiOk({ case: row }, { status: 201 });
};
