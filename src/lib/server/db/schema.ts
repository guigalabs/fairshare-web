import { integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const genId = () => crypto.randomUUID();
const now = () => new Date();

// Dates and timestamps:
//   Full timestamps: `integer({ mode: "timestamp_ms" })` — Unix epoch (ms),
//   drizzle marshals to/from JS Date.
//   Date-only fields (e.g. dateOfDeath): plain `text` storing YYYY-MM-DD strings,
//   matching what the app passes to input[type=date].
// Money:
//   stored as decimal-safe TEXT (e.g. "487000.00"). The app already parses
//   via parseCents() / formatCents() — same shape as the previous Postgres
//   `numeric(18,2)` semantics, just without the engine-side type check.
// JSON:
//   text({ mode: "json" }). SQLite has JSON1 built in if we ever need to
//   query inside.

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(genId),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const clients = sqliteTable("client", {
  id: text("id")
    .primaryKey()
    .$defaultFn(genId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  primaryContactName: text("primary_contact_name"),
  primaryContactEmail: text("primary_contact_email"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
});

export const caseFolders = sqliteTable("case_folder", {
  id: text("id")
    .primaryKey()
    .$defaultFn(genId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
});

export const cases = sqliteTable("case", {
  id: text("id")
    .primaryKey()
    .$defaultFn(genId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  folderId: text("folder_id").references(() => caseFolders.id, { onDelete: "set null" }),
  deceasedName: text("deceased_name").notNull(),
  dateOfDeath: text("date_of_death"),
  placeOfDeath: text("place_of_death"),
  jurisdiction: text("jurisdiction"),
  deceasedIdentifier: text("deceased_identifier"),
  hearingDate: text("hearing_date"),
  notes: text("notes"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  subjectGender: text("subject_gender").notNull(),
  madhhab: text("madhhab").notNull(),
  heirs: text("heirs", { mode: "json" }).notNull(),
  currency: text("currency").notNull().default("USD"),
  grossEstate: text("gross_estate"),
  funeralExpenses: text("funeral_expenses").notNull().default("0"),
  debts: text("debts", { mode: "json" }).notNull().default([]),
  bequests: text("bequests", { mode: "json" }).notNull().default([]),
  specialFlags: text("special_flags", { mode: "json" }).notNull().default({}),
  advisoryNotes: text("advisory_notes"),
  resultSnapshot: text("result_snapshot", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
});

export const subscriptions = sqliteTable("subscription", {
  id: text("id")
    .primaryKey()
    .$defaultFn(genId),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan").notNull().default("pro"),
  cadence: text("cadence").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp_ms" }),
  /**
   * Unix timestamp (seconds) of the most recent Stripe event applied to this
   * row. Used to ignore out-of-order or replayed events that would otherwise
   * revert the subscription to an older state.
   */
  lastEventAt: integer("last_event_at"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
});

/**
 * Stripe redelivers webhook events on 5xx/timeouts. We record every processed
 * event id so the webhook handler can short-circuit duplicates without
 * re-running applySubscriptionEvent.
 */
export const processedWebhookEvents = sqliteTable("processed_webhook_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: integer("processed_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
});

export const waitlist = sqliteTable(
  "waitlist",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(genId),
    email: text("email").notNull(),
    /** "pro" or "ios". */
    source: text("source").notNull(),
    /** Optional referrer URL captured from document.referrer at submit. */
    referrer: text("referrer"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(now),
  },
  // One row per (email, source) pair — a user can sign up for both Pro and
  // iOS independently, but not duplicate themselves on the same list.
  (t) => [unique("waitlist_email_source_uniq").on(t.email, t.source)],
);

export const firmBranding = sqliteTable("firm_branding", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  logoObjectKey: text("logo_object_key"),
  letterheadText: text("letterhead_text"),
  customDisclaimerEn: text("custom_disclaimer_en"),
  customDisclaimerAr: text("custom_disclaimer_ar"),
  primaryColor: text("primary_color"),
  signatureBlock: text("signature_block"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(now),
});
