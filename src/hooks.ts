// Universal hook (runs in both client and server). Strips the "/ar/" locale
// prefix from incoming URLs so the route file structure stays single-tree.
// event.url is preserved as the original URL — pages still see "/ar/..."
// and use that to drive language, canonical, and hreflang.

import type { Reroute } from "@sveltejs/kit";
import { stripLocale, isArPath } from "$lib/i18n/url";

export const reroute: Reroute = ({ url }) => {
  if (isArPath(url.pathname)) return stripLocale(url.pathname);
};
