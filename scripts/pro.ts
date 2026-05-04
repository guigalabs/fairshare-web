#!/usr/bin/env bun
/**
 * Manually grant / revoke / list FairShare Pro access without Stripe.
 *
 * Used while Stripe Managed Payments isn't wired up in production: insert
 * a synthetic subscription row so the user clears `hasProEntitlement`
 * (status='active', current_period_end far in the future). Once Stripe
 * is live, remove these rows and let real webhooks own the table.
 *
 * Usage (from repo root, with DATABASE_URL exported):
 *   bun run pro:grant amina@firm.com
 *   bun run pro:grant amina@firm.com --annual
 *   bun run pro:revoke amina@firm.com
 *   bun run pro:list
 */
import { eq } from "drizzle-orm";
import { makeDb } from "../src/lib/server/db/client";
import { subscriptions, users } from "../src/lib/server/db/schema";

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) die("DATABASE_URL is not set");

const db = makeDb(databaseUrl);

const [, , command, ...rest] = process.argv;

async function findUserByEmail(email: string) {
  const rows = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

async function grant(email: string, cadence: "monthly" | "annual") {
  const user = await findUserByEmail(email);
  if (!user) die(`no user with email ${email}; have them sign in once first`);

  const periodEnd = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
  const values = {
    userId: user.id,
    stripeSubscriptionId: `manual_${user.id}`,
    stripeCustomerId: null,
    plan: "pro" as const,
    cadence,
    status: "active",
    currentPeriodEnd: periodEnd,
    updatedAt: new Date(),
  };

  const existing = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  if (existing[0]) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.userId, user.id));
    console.log(`updated existing subscription for ${email} (${cadence})`);
  } else {
    await db.insert(subscriptions).values(values);
    console.log(`granted Pro to ${email} (${cadence})`);
  }
}

async function revoke(email: string) {
  const user = await findUserByEmail(email);
  if (!user) die(`no user with email ${email}`);
  const result = await db.delete(subscriptions).where(eq(subscriptions.userId, user.id));
  console.log(`revoked Pro from ${email}`, result);
}

async function list() {
  const rows = await db
    .select({
      email: users.email,
      cadence: subscriptions.cadence,
      status: subscriptions.status,
      stripeSubscriptionId: subscriptions.stripeSubscriptionId,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
    })
    .from(subscriptions)
    .innerJoin(users, eq(users.id, subscriptions.userId));
  if (rows.length === 0) {
    console.log("no subscriptions");
    return;
  }
  for (const r of rows) {
    const manual = r.stripeSubscriptionId?.startsWith("manual_") ? " [manual]" : "";
    const ends = r.currentPeriodEnd ? r.currentPeriodEnd.toISOString().slice(0, 10) : "—";
    console.log(`${r.email}\t${r.status}\t${r.cadence}\tends ${ends}${manual}`);
  }
}

async function main() {
  switch (command) {
    case "grant": {
      const email = rest[0];
      if (!email) die("usage: pro grant <email> [--annual]");
      const cadence = rest.includes("--annual") ? "annual" : "monthly";
      await grant(email, cadence);
      break;
    }
    case "revoke": {
      const email = rest[0];
      if (!email) die("usage: pro revoke <email>");
      await revoke(email);
      break;
    }
    case "list":
      await list();
      break;
    default:
      die("usage: pro <grant|revoke|list> [args]");
  }
}

await main();
