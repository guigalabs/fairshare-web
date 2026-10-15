import { and, eq, gt, ne, sql } from "drizzle-orm";
import type { makeDb } from "./db/client";
import { loginAttempts, verificationTokens } from "./db/schema";
import { isSignInCode } from "./email";

export const MAX_FAILURES = 5;
export const MAX_SENDS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const SEND_WINDOW_MS = 60 * 60 * 1000;

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
 * Runs before Auth.js sees the callback. The attempt is counted first, in one
 * atomic upsert, so parallel guesses can't all read the same count. Five
 * attempts per address per 10 minutes, then the pending codes are deleted.
 */
export async function checkSignInCode(
  db: Db,
  secret: string,
  email: string,
  code: string,
  now = Date.now(),
): Promise<CodeCheck> {
  const stale = now - WINDOW_MS;
  const [row] = await db
    .insert(loginAttempts)
    .values({ identifier: email, failures: 1, since: now, sends: 0, sendsSince: now })
    .onConflictDoUpdate({
      target: loginAttempts.identifier,
      set: {
        failures: sql`CASE WHEN ${loginAttempts.since} < ${stale} THEN 1 ELSE ${loginAttempts.failures} + 1 END`,
        since: sql`CASE WHEN ${loginAttempts.since} < ${stale} THEN ${now} ELSE ${loginAttempts.since} END`,
      },
    })
    .returning({ failures: loginAttempts.failures });

  const burn = () => db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));
  if (row.failures > MAX_FAILURES) {
    await burn();
    return "locked";
  }

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
    await db.update(loginAttempts).set({ failures: 0 }).where(eq(loginAttempts.identifier, email));
    return "ok";
  }
  if (row.failures >= MAX_FAILURES) {
    await burn();
    return "locked";
  }
  return "wrong";
}

/**
 * Called as each code goes out. Only the newest code stays valid, so asking
 * for several doesn't multiply the odds of a guess, and an address gets at
 * most five code emails an hour. Returns false when over that limit.
 */
export async function noteCodeSent(
  db: Db,
  secret: string,
  email: string,
  code: string,
  now = Date.now(),
): Promise<boolean> {
  const stale = now - SEND_WINDOW_MS;
  const [row] = await db
    .insert(loginAttempts)
    .values({ identifier: email, failures: 0, since: now, sends: 1, sendsSince: now })
    .onConflictDoUpdate({
      target: loginAttempts.identifier,
      set: {
        sends: sql`CASE WHEN ${loginAttempts.sendsSince} < ${stale} THEN 1 ELSE ${loginAttempts.sends} + 1 END`,
        sendsSince: sql`CASE WHEN ${loginAttempts.sendsSince} < ${stale} THEN ${now} ELSE ${loginAttempts.sendsSince} END`,
      },
    })
    .returning({ sends: loginAttempts.sends });
  const allowed = row.sends <= MAX_SENDS;
  const newest = await hashToken(code, secret);
  await db
    .delete(verificationTokens)
    .where(
      allowed
        ? and(eq(verificationTokens.identifier, email), ne(verificationTokens.token, newest))
        : eq(verificationTokens.identifier, email),
    );
  return allowed;
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
