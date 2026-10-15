import { isRedirect, redirect } from "@sveltejs/kit";
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
    try {
      return await signIn(event);
    } catch (err) {
      // A send refused for rate limits or a mail error gets the page's notice, not a 500.
      if (isRedirect(err)) throw err;
      console.error("sign-in code not sent", err);
      redirect(303, "/login?error=EmailSignin");
    }
  },
};
