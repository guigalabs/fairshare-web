import { and, eq, gt } from "drizzle-orm";
import type { makeDb } from "./db/client";
import { loginAttempts, verificationTokens } from "./db/schema";
import { isSignInCode } from "./email";

export const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000;

type Db = ReturnType<typeof makeDb>;

/** Auth.js stores sha256(token + secret) as hex, never the code itself. */
export async function hashToken(token: string, secret: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${token}${secret}`),
  );
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type CodeCheck = "ok" | "wrong" | "locked";

/**
 * Runs before Auth.js sees the callback. Counts wrong codes per email and,
 * on the fifth, deletes that email's pending codes so guessing gets nowhere.
 */
export async function checkSignInCode(
  db: Db,
  secret: string,
  email: string,
  code: string,
  now = Date.now(),
): Promise<CodeCheck> {
  const [attempt] = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.identifier, email));
  const fresh = attempt && now - attempt.since.getTime() < WINDOW_MS;
  if (fresh && attempt.failures >= MAX_FAILURES) return "locked";

  const valid =
    isSignInCode(code) &&
    (
      await db
        .select({ identifier: verificationTokens.identifier })
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, email),
            eq(verificationTokens.token, await hashToken(code, secret)),
            gt(verificationTokens.expires, new Date(now)),
          ),
        )
    ).length > 0;

  if (valid) {
    await db.delete(loginAttempts).where(eq(loginAttempts.identifier, email));
    return "ok";
  }

  const failures = fresh ? attempt.failures + 1 : 1;
  await db
    .insert(loginAttempts)
    .values({ identifier: email, failures, since: fresh ? attempt.since : new Date(now) })
    .onConflictDoUpdate({
      target: loginAttempts.identifier,
      set: { failures, since: fresh ? attempt.since : new Date(now) },
    });
  if (failures >= MAX_FAILURES) {
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));
    return "locked";
  }
  return "wrong";
}

/** Same rules as Auth.js's default email normalizer, so lookups match what it stored. */
export function normalizeEmail(raw: string): string | null {
  const email = raw.toLowerCase().trim();
  if (email.includes('"')) return null;
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return `${parts[0]}@${parts[1].split(",")[0]}`;
}

export const LOGIN_EMAIL_COOKIE = "fs_login_email";
