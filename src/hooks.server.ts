import { building } from "$app/environment";
import { redirect, type Handle } from "@sveltejs/kit";
import { handle as authHandle } from "$lib/server/auth";
import { makeDb } from "$lib/server/db/client";
import { checkSignInCode, normalizeEmail } from "$lib/server/signin-code";
import { localeFromPath } from "$lib/i18n/url";

// 1. Auth.js wraps the request when AUTH_SECRET is set; otherwise we skip
//    its handle entirely so /app/* falls through to the route guards.
// 2. transformPageChunk swaps the hardcoded `lang="en" dir="ltr"` on
//    <html> in app.html for whatever the URL says, so SSR'd Arabic pages
//    arrive at the browser with correct lang+dir on the very first paint
//    (no hydration flash, no waiting for client JS to fix it up).
const swapHtmlLang: Handle = ({ event, resolve }) => {
  const lang = localeFromPath(event.url.pathname);
  const dir = lang === "ar" ? "rtl" : "ltr";
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('<html lang="en" dir="ltr">', `<html lang="${lang}" dir="${dir}">`),
  });
};

export const handle: Handle = async ({ event, resolve }) => {
  // Prerendered pages are public and must not touch secrets.
  if (building) return swapHtmlLang({ event, resolve });
  const env = event.platform?.env;
  if (!env?.AUTH_SECRET) return swapHtmlLang({ event, resolve });

  // Every email code passes through here before Auth.js, so wrong guesses
  // are counted and a fifth one burns the code. Auth.js reads the last value
  // of a repeated query param, so repeats are refused outright.
  if (event.url.pathname.replace(/\/+$/, "") === "/auth/callback/resend") {
    const params = event.url.searchParams;
    if (event.request.method !== "GET") return new Response(null, { status: 405 });
    if (params.getAll("email").length !== 1 || params.getAll("token").length !== 1) {
      redirect(303, "/login");
    }
    const email = normalizeEmail(params.get("email") ?? "");
    if (!email || email !== params.get("email")) redirect(303, "/login");
    const result = await checkSignInCode(
      makeDb(env.DB),
      env.AUTH_SECRET,
      email,
      params.get("token") ?? "",
    );
    if (result === "locked") redirect(303, "/login?error=locked");
    if (result === "wrong") redirect(303, "/login/verify?error=wrong");
  }

  return authHandle({ event, resolve: (e) => swapHtmlLang({ event: e, resolve }) });
};
