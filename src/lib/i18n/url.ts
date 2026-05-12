// URL helpers for locale-prefixed routing.
//
// Convention: EN is canonical at no prefix ("/calculate/"); AR lives under
// "/ar/" ("/ar/calculate/"). The reroute hook strips "/ar/" so the actual
// route file is the same for both locales.

import { i18n, type Locale } from "./index.svelte";

const SITE = "https://fairshare.guigalabs.com";

/** True when the path is the Arabic locale prefix. */
export function isArPath(pathname: string): boolean {
  return pathname === "/ar" || pathname === "/ar/" || pathname.startsWith("/ar/");
}

/** Detect locale from a pathname. */
export function localeFromPath(pathname: string): Locale {
  return isArPath(pathname) ? "ar" : "en";
}

/** Strip the AR prefix and return the canonical EN path (always with leading slash). */
export function stripLocale(pathname: string): string {
  if (pathname === "/ar" || pathname === "/ar/") return "/";
  if (pathname.startsWith("/ar/")) return pathname.slice(3);
  return pathname;
}

/** Prepend the locale prefix. Pass any path that starts with "/". */
export function localePath(path: string, locale: Locale): string {
  if (locale === "en") return path;
  if (path === "/") return "/ar/";
  return `/ar${path}`;
}

/** Given a pathname, return its alternate-locale counterpart. */
export function altLocalePath(pathname: string, currentLocale: Locale): string {
  const en = stripLocale(pathname);
  return currentLocale === "en" ? localePath(en, "ar") : en;
}

/** Build a fully-qualified canonical URL for a pathname (always trailing slash). */
export function pageUrl(pathname: string): string {
  if (pathname === "/" || pathname === "") return `${SITE}/`;
  const trimmed = pathname.replace(/\/+$/, "");
  return `${SITE}${trimmed}/`;
}

/**
 * Locale-aware href helper: `loc("/calculate")` returns "/calculate" in EN
 * and "/ar/calculate" in AR. Reads i18n.current reactively, so callsites
 * like `href={loc("/calculate")}` re-render when the locale changes.
 */
export function loc(path: string): string {
  return localePath(path, i18n.current);
}
