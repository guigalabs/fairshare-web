import type { Actions } from "./$types";
import { signIn } from "$lib/server/auth";
import { LOGIN_EMAIL_COOKIE, normalizeEmail } from "$lib/server/signin-code";

export const prerender = false;

export const actions: Actions = {
  // Remember the address so the code page can finish sign-in without asking again.
  default: async (event) => {
    const form = await event.request.clone().formData();
    const email = normalizeEmail(String(form.get("email") ?? ""));
    if (email) {
      event.cookies.set(LOGIN_EMAIL_COOKIE, email, {
        path: "/",
        maxAge: 10 * 60,
        httpOnly: true,
        sameSite: "lax",
        secure: event.url.protocol === "https:",
      });
    }
    return signIn(event);
  },
};
