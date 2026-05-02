// Lightweight i18n. Single bundle of EN + AR loaded statically — no
// dynamic import gymnastics for two locales. Persists choice to localStorage
// and applies dir="rtl" / lang="ar" to <html>.
//
// Full URL-based locale routing (/[locale]/...) lands with B9 when the
// methodology pages bring SEO-distinct content per locale. For the
// calculator UI, a simple in-app toggle is enough.

import { browser } from "$app/environment";
import en from "../../../messages/en.json";
import ar from "../../../messages/ar.json";

export type Locale = "en" | "ar";

export const LOCALES: readonly Locale[] = ["en", "ar"] as const;

const MESSAGES: Record<Locale, Record<string, string>> = { en, ar };

const STORAGE_KEY = "fairshare:locale";

function readStored(): Locale {
  if (!browser) return "en";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "ar" ? "ar" : "en";
}

function applyToDocument(locale: Locale): void {
  if (!browser) return;
  const root = document.documentElement;
  root.setAttribute("lang", locale);
  root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
}

class I18n {
  current: Locale = $state(readStored());

  constructor() {
    if (browser) {
      applyToDocument(this.current);
      $effect.root(() => {
        $effect(() => {
          applyToDocument(this.current);
          localStorage.setItem(STORAGE_KEY, this.current);
        });
      });
    }
  }

  set(locale: Locale): void {
    this.current = locale;
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
