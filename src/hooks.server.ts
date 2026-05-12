import type { Handle } from "@sveltejs/kit";
import { handle as authHandle } from "$lib/server/auth";
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
  if (!event.platform?.env?.AUTH_SECRET) return swapHtmlLang({ event, resolve });
  return authHandle({ event, resolve: (e) => swapHtmlLang({ event: e, resolve }) });
};
