import type { LayoutLoad } from "./$types";
import { localeFromPath } from "$lib/i18n/url";

export const prerender = true;

export const load: LayoutLoad = ({ url }) => {
  // URL drives the locale. Reroute strips "/ar" before the router sees
  // it, but event.url and url here are unchanged — we can still read
  // the requested pathname to decide language.
  return { lang: localeFromPath(url.pathname) };
};
