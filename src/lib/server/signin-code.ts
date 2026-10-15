import { and, eq, ne, sql } from "drizzle-orm";
import type { Adapter, VerificationToken } from "@auth/sveltekit/adapters";
import type { makeDb } from "./db/client";
import { loginAttempts, verificationTokens } from "./db/schema";

/** Wrong guesses allowed per code. A new code resets the count. */
export const MAX_FAILURES = 5;
/** Wrong guesses per address per day, across every code. New codes don't reset it. */
export const MAX_DAY_FAILURES = 15;
/** Code emails per address per hour. */
export const MAX_SENDS = 5;
const SEND_WINDOW_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type Db = ReturnType<typeof makeDb>;

/** Auth.js stores sha256(token + secret) as hex, never the code itself. */
export async function hashToken(token: string, secret: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${token}${secret}`),
  );
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Wraps the adapter's token lookup, which is the one place Auth.js checks a
 * code. Counting here means the limit sees exactly the email and token Auth.js
 * sees, with no URL parsing of our own. Each attempt is counted first in one
 * atomic upsert, so parallel guesses can't share a count. Only an exact,
 * already-normalized email can match, so case tricks just open a counter that
 * can never succeed.
 */
export function limitCodeGuesses(db: Db, base: Adapter): Adapter {
  const use = base.useVerificationToken;
  if (!use) throw new Error("adapter has no useVerificationToken");
  return {
    ...base,
    useVerificationToken: async (params: { identifier: string; token: string }) => {
      const { identifier } = params;
      if (!identifier) return null;
      const now = Date.now();
      const dayStale = now - DAY_MS;
      const [row] = await db
        .insert(loginAttempts)
        .values({
          identifier,
          failures: 1,
          since: now,
          sends: 0,
          sendsSince: now,
          dayFailures: 1,
          daySince: now,
        })
        .onConflictDoUpdate({
          target: loginAttempts.identifier,
          set: {
            failures: sql`${loginAttempts.failures} + 1`,
            dayFailures: sql`CASE WHEN ${loginAttempts.daySince} < ${dayStale} THEN 1 ELSE ${loginAttempts.dayFailures} + 1 END`,
            daySince: sql`CASE WHEN ${loginAttempts.daySince} < ${dayStale} THEN ${now} ELSE ${loginAttempts.daySince} END`,
          },
        })
        .returning({ failures: loginAttempts.failures, dayFailures: loginAttempts.dayFailures });
      if (row.failures > MAX_FAILURES || row.dayFailures > MAX_DAY_FAILURES) {
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
        return null;
      }
      const found: VerificationToken | null = await use(params);
      if (found) {
        // Undo this attempt's count; a correct code isn't a failure.
        await db
          .update(loginAttempts)
          .set({ failures: 0, dayFailures: sql`${loginAttempts.dayFailures} - 1` })
          .where(eq(loginAttempts.identifier, identifier));
      } else if (row.failures >= MAX_FAILURES || row.dayFailures >= MAX_DAY_FAILURES) {
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
      }
      return found;
    },
  };
}

/**
 * Called as each code goes out. Only the newest code stays valid, the
 * per-code guess count starts over (the daily one doesn't), and an address
 * gets at most five code emails an hour.
 * Returns false when over that limit.
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
    .values({
      identifier: email,
      failures: 0,
      since: now,
      sends: 1,
      sendsSince: now,
      dayFailures: 0,
      daySince: now,
    })
    .onConflictDoUpdate({
      target: loginAttempts.identifier,
      set: {
        failures: 0,
        since: now,
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
