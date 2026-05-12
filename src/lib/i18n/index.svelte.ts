// Lightweight i18n. Single bundle of EN + AR loaded statically — no
// dynamic import gymnastics for two locales.
//
// Locale is URL-driven: "/x" is English (canonical), "/ar/x" is Arabic.
// The reroute hook in src/hooks.ts strips the "/ar" prefix before the
// router runs so route files stay single-tree. +layout.ts reads the
// pathname and returns `lang` on page.data, and i18n.current is a
// reactive getter over page.data so SSR sees the right locale on the
// very first render (no hydration flash) and client navigations pick
// up the new locale the instant the URL changes.

import { page } from "$app/state";
import en from "../../../messages/en.json";
import ar from "../../../messages/ar.json";

export type Locale = "en" | "ar";

export const LOCALES: readonly Locale[] = ["en", "ar"] as const;

const MESSAGES: Record<Locale, Record<string, string>> = { en, ar };

function readLang(): Locale {
  const v = page.data?.lang;
  return v === "ar" ? "ar" : "en";
}

class I18n {
  get current(): Locale {
    return readLang();
  }

  /**
   * Look up a translation. Falls back to the key itself when missing — makes
   * untranslated strings visible during development. Supports {placeholder}
   * substitution.
   */
  t(key: string, vars?: Record<string, string | number>): string {
    const bundle = MESSAGES[this.current] ?? MESSAGES.en;
    const raw = bundle[key] ?? MESSAGES.en[key] ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  }
}

export const i18n = new I18n();

/** Convenience reactive accessor. */
export function t(key: string, vars?: Record<string, string | number>): string {
  return i18n.t(key, vars);
}
