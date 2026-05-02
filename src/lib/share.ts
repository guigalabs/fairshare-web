// URL-encoded sharing for InheritanceCase + Web Share API helper.

import type { Gender, HeirEntry, InheritanceCase, Madhhab } from "$engine";
import { inheritanceCase } from "$engine";

interface CompactCase {
  g: Gender;
  m: Madhhab;
  /** Pairs of [type, count]. */
  h: [string, number][];
}

function toCompact(c: InheritanceCase): CompactCase {
  return {
    g: c.subjectGender,
    m: c.madhhab,
    h: c.heirs.map((e) => [e.type, e.count] as [string, number]),
  };
}

function fromCompact(x: CompactCase): InheritanceCase {
  const heirs: HeirEntry[] = x.h.map(([type, count]) => ({
    type: type as HeirEntry["type"],
    count,
  }));
  return inheritanceCase(x.g, heirs, x.m);
}

function base64UrlEncode(s: string): string {
  // Browser-only; OK because share.ts is only used in client code paths.
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return decodeURIComponent(escape(atob(b64 + pad)));
}

export function encodeCase(c: InheritanceCase): string {
  return base64UrlEncode(JSON.stringify(toCompact(c)));
}

export function decodeCase(token: string): InheritanceCase | null {
  try {
    const json = base64UrlDecode(token);
    const parsed = JSON.parse(json) as CompactCase;
    if (!parsed.h || !Array.isArray(parsed.h)) return null;
    return fromCompact(parsed);
  } catch {
    return null;
  }
}

export function shareUrlFor(c: InheritanceCase, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/result?case=${encodeCase(c)}`;
}

/** Try Web Share API; fall back to clipboard. Returns "share" | "clipboard" | "error". */
export async function share(opts: {
  title: string;
  text: string;
  url: string;
}): Promise<"share" | "clipboard" | "error"> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share(opts);
      return "share";
    } catch {
      // user cancelled, or share rejected — fall through to clipboard
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(opts.url);
      return "clipboard";
    } catch {
      return "error";
    }
  }
  return "error";
}
