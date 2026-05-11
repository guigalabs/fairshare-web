import {
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
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

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const clients = pgTable("client", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  primaryContactName: text("primary_contact_name"),
  primaryContactEmail: text("primary_contact_email"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const caseFolders = pgTable("case_folder", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const cases = pgTable("case", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  folderId: text("folder_id").references(() => caseFolders.id, { onDelete: "set null" }),
  deceasedName: text("deceased_name").notNull(),
  dateOfDeath: date("date_of_death"),
  placeOfDeath: text("place_of_death"),
  jurisdiction: text("jurisdiction"),
  deceasedIdentifier: text("deceased_identifier"),
  hearingDate: date("hearing_date"),
  notes: text("notes"),
  tags: text("tags").array().notNull().default([]),
  subjectGender: text("subject_gender").notNull(),
  madhhab: text("madhhab").notNull(),
  heirs: jsonb("heirs").notNull(),
  currency: text("currency").notNull().default("USD"),
  grossEstate: numeric("gross_estate", { precision: 18, scale: 2 }),
  funeralExpenses: numeric("funeral_expenses", { precision: 18, scale: 2 }).notNull().default("0"),
  debts: jsonb("debts").notNull().default([]),
  bequests: jsonb("bequests").notNull().default([]),
  specialFlags: jsonb("special_flags").notNull().default({}),
  advisoryNotes: text("advisory_notes"),
  resultSnapshot: jsonb("result_snapshot"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const subscriptions = pgTable("subscription", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan").notNull().default("pro"),
  cadence: text("cadence").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  /**
   * Unix timestamp (seconds) of the most recent Stripe event applied
   * to this row. Used to ignore out-of-order or replayed events that
   * would otherwise revert the subscription to an older state.
   */
  lastEventAt: integer("last_event_at"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

/**
 * Stripe redelivers webhook events on 5xx/timeouts. We record every
 * processed event id so the webhook handler can short-circuit duplicates
 * without re-running applySubscriptionEvent.
 */
export const processedWebhookEvents = pgTable("processed_webhook_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: timestamp("processed_at", { mode: "date" }).notNull().defaultNow(),
});

export const waitlist = pgTable(
  "waitlist",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    /** "pro" or "ios". */
    source: text("source").notNull(),
    /** Optional referrer URL captured from document.referrer at submit. */
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  // One row per (email, source) pair — a user can sign up for both Pro and
  // iOS independently, but not duplicate themselves on the same list.
  (t) => [unique("waitlist_email_source_uniq").on(t.email, t.source)],
);

export const firmBranding = pgTable("firm_branding", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  logoObjectKey: text("logo_object_key"),
  letterheadText: text("letterhead_text"),
  customDisclaimerEn: text("custom_disclaimer_en"),
  customDisclaimerAr: text("custom_disclaimer_ar"),
  primaryColor: text("primary_color"),
  signatureBlock: text("signature_block"),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
