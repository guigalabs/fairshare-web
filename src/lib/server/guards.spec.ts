import type { Session } from "@auth/sveltekit";
import { isRedirect } from "@sveltejs/kit";
import { describe, expect, it } from "vitest";
import { requireSession } from "./guards";

function makeEvent(session: Session | null, url = "https://x/app/cases") {
  return {
    locals: { auth: async () => session },
    url: new URL(url),
  };
}

async function captureRedirect(fn: () => Promise<unknown>): Promise<{
  status: number;
  location: string;
}> {
  try {
    await fn();
  } catch (e) {
    if (isRedirect(e)) return { status: e.status, location: e.location };
    throw e;
  }
  throw new Error("expected a redirect; the call returned normally");
}

describe("requireSession", () => {
  it("returns the session when the user is authenticated", async () => {
    const session = { user: { email: "amina@firm.com" }, expires: "2099-01-01" } as Session;
    const result = await requireSession(makeEvent(session));
    expect(result.user.email).toBe("amina@firm.com");
  });

  it("redirects to /login with `from` query when no session", async () => {
    const r = await captureRedirect(() => requireSession(makeEvent(null, "https://x/app/cases")));
    expect(r).toEqual({ status: 302, location: "/login?from=%2Fapp%2Fcases" });
  });

  it("preserves the query string in the `from` parameter", async () => {
    const r = await captureRedirect(() =>
      requireSession(makeEvent(null, "https://x/app/cases?folder=42")),
    );
    expect(r.location).toBe("/login?from=%2Fapp%2Fcases%3Ffolder%3D42");
  });

  it("redirects when session has no user (defensive — Auth.js can yield this)", async () => {
    const r = await captureRedirect(() =>
      requireSession(makeEvent({ expires: "2099-01-01" } as Session)),
    );
    expect(r.status).toBe(302);
  });

  it("redirects when locals.auth is missing (AUTH_SECRET unset, auth handle skipped)", async () => {
    const r = await captureRedirect(() =>
      requireSession({ locals: {}, url: new URL("https://x/app/cases") }),
    );
    expect(r).toEqual({ status: 302, location: "/login?from=%2Fapp%2Fcases" });
  });

  it("redirects to /ar/login when the request came from the /ar subtree", async () => {
    const r = await captureRedirect(() =>
      requireSession(makeEvent(null, "https://x/ar/app/cases")),
    );
    expect(r).toEqual({ status: 302, location: "/ar/login?from=%2Far%2Fapp%2Fcases" });
  });

  it("redirects to /ar/login when locals.auth is missing on an AR request", async () => {
    const r = await captureRedirect(() =>
      requireSession({ locals: {}, url: new URL("https://x/ar/app/cases?folder=7") }),
    );
    expect(r.location).toBe("/ar/login?from=%2Far%2Fapp%2Fcases%3Ffolder%3D7");
  });
});
