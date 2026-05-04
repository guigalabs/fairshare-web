import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { apiOk, authedApiContext } from "$lib/server/api";
import { users } from "$lib/server/db/schema";

export const prerender = false;

/**
 * Hard-delete the authenticated user. Cascades to accounts, sessions,
 * cases, clients, and firm_branding via the user_id ON DELETE CASCADE
 * foreign keys. The auth cookie is invalidated separately by the
 * client redirecting to /auth/signout.
 *
 * v1 deletes immediately; the 30-day soft-delete grace period is
 * Phase 2 work (requires user.deleted_at + a Cloudflare Cron Trigger
 * to purge rows past the window).
 */
export const DELETE: RequestHandler = async (event) => {
  const ctx = await authedApiContext(event);
  await ctx.db.delete(users).where(eq(users.id, ctx.userId));
  return apiOk({ ok: true });
};
