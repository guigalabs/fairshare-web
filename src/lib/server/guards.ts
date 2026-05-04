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
  locals: { auth: () => Promise<Session | null> };
  url: URL;
}): Promise<AuthenticatedSession> {
  const session = await event.locals.auth();
  if (!session?.user?.email) {
    const from = event.url.pathname + event.url.search;
    throw redirect(302, `/login?from=${encodeURIComponent(from)}`);
  }
  return session as AuthenticatedSession;
}
