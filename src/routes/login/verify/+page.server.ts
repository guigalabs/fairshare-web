import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { isSignInCode } from "$lib/server/email";
import { LOGIN_EMAIL_COOKIE } from "$lib/server/signin-code";

export const prerender = false;

export const load: PageServerLoad = ({ cookies, url }) => ({
  email: cookies.get(LOGIN_EMAIL_COOKIE) ?? null,
  error: url.searchParams.get("error"),
});

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const email = cookies.get(LOGIN_EMAIL_COOKIE);
    if (!email) redirect(303, "/login");
    const code = String((await request.formData()).get("code") ?? "").replace(/\s/g, "");
    if (!isSignInCode(code)) return fail(400, { error: "format" });
    const q = new URLSearchParams({ email, token: code, callbackUrl: "/app" });
    redirect(303, `/auth/callback/resend?${q}`);
  },
};
