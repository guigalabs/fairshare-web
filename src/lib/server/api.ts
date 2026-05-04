import { error, json } from "@sveltejs/kit";
import type { Session } from "@auth/sveltekit";
import type { z } from "zod";
import { type DB, makeDb } from "./db/client";

export interface ApiRequestEvent {
  request: Request;
  locals: { auth: () => Promise<Session | null> };
  platform?: App.Platform;
}

export interface AuthenticatedApiContext {
  userId: string;
  email: string;
  db: DB;
}

/**
 * Extract a Drizzle client + the authenticated user from a SvelteKit
 * request event. Throws 401 (not a redirect — these are JSON endpoints)
 * if the visitor is unauthenticated.
 */
export async function authedApiContext(event: ApiRequestEvent): Promise<AuthenticatedApiContext> {
  const session = await event.locals.auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;
  if (!userId || !email) throw error(401, "unauthenticated");
  const databaseUrl = event.platform?.env?.DATABASE_URL;
  if (!databaseUrl) throw error(500, "database_not_configured");
  return { userId, email, db: makeDb(databaseUrl) };
}

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw error(400, "invalid_json");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw error(400, { message: "invalid_input", issues: result.error.issues } as never);
  }
  return result.data;
}

export const apiOk = json;
