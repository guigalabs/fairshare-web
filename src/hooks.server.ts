import type { Handle } from "@sveltejs/kit";
import { handle as authHandle } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  // Auth.js needs Cloudflare bindings (DB, AUTH_SECRET, ...).
  // In `vite dev` / `vite preview` they're absent, so render unauthenticated.
  if (!event.platform?.env?.AUTH_SECRET) return resolve(event);
  return authHandle({ event, resolve });
};
