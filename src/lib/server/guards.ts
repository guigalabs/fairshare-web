import { redirect } from "@sveltejs/kit";
import type { Session } from "@auth/sveltekit";

export interface AuthenticatedSession extends Session {
  user: NonNullable<Session["user"]> & { email: string };
}

/**
 * Resolve the current Auth.js session or send the visitor to /login.
 *
 * The redirect appends `?from=<current path>` so the login page can route
 * back to where the user was trying to go after authenticating.
 */
export async function requireSession(event: {
  locals: { auth?: () => Promise<Session | null> };
  url: URL;
}): Promise<AuthenticatedSession> {
  // When AUTH_SECRET is unset in prod, hooks.server.ts skips the Auth.js
  // handle and event.locals.auth is never installed. Treat that the same
  // as "no session" so the route redirects to /login instead of 500'ing.
  const session = typeof event.locals.auth === "function" ? await event.locals.auth() : null;
  if (!session?.user?.email) {
    const from = event.url.pathname + event.url.search;
    throw redirect(302, `/login?from=${encodeURIComponent(from)}`);
  }
  return session as AuthenticatedSession;
}
