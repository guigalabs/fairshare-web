import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import {
  accounts,
  caseFolders,
  cases,
  clients,
  firmBranding,
  sessions,
  users,
  verificationTokens,
} from "./schema";

function columnNames(table: Parameters<typeof getTableConfig>[0]): Set<string> {
  return new Set(getTableConfig(table).columns.map((c) => c.name));
}

describe("auth schema", () => {
  it.each([
    ["user", users, ["id", "name", "email", "emailVerified", "image"]],
    [
      "account",
      accounts,
      [
        "userId",
        "type",
        "provider",
        "providerAccountId",
        "refresh_token",
        "access_token",
        "expires_at",
        "token_type",
        "scope",
        "id_token",
        "session_state",
      ],
    ],
    ["session", sessions, ["sessionToken", "userId", "expires"]],
    ["verificationToken", verificationTokens, ["identifier", "token", "expires"]],
  ])("%s table has Auth.js-required columns", (_name, table, expected) => {
    expect(columnNames(table)).toEqual(new Set(expected));
  });

  it("user.email is unique and not null", () => {
    const email = getTableConfig(users).columns.find((c) => c.name === "email");
    expect(email?.notNull).toBe(true);
    expect(email?.isUnique).toBe(true);
  });

  it("session.userId cascades on user delete", () => {
    const fks = getTableConfig(sessions).foreignKeys;
    expect(fks.length).toBe(1);
    expect(fks[0]?.onDelete).toBe("cascade");
  });

  it("account.(provider, providerAccountId) is the composite primary key", () => {
    const pks = getTableConfig(accounts).primaryKeys;
    expect(pks.length).toBe(1);
    const cols = pks[0]?.columns.map((c) => c.name).sort();
    expect(cols).toEqual(["provider", "providerAccountId"].sort());
  });
});

describe("Pro schema", () => {
  it.each([
    [
      "client",
      clients,
      [
        "id",
        "user_id",
        "display_name",
        "primary_contact_name",
        "primary_contact_email",
        "notes",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
    ],
    ["case_folder", caseFolders, ["id", "user_id", "name", "created_at"]],
    [
      "case",
      cases,
      [
        "id",
        "user_id",
        "client_id",
        "folder_id",
        "deceased_name",
        "date_of_death",
        "place_of_death",
        "jurisdiction",
        "deceased_identifier",
        "hearing_date",
        "notes",
        "tags",
        "subject_gender",
        "madhhab",
        "heirs",
        "currency",
        "gross_estate",
        "funeral_expenses",
        "debts",
        "bequests",
        "special_flags",
        "advisory_notes",
        "result_snapshot",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
    ],
    [
      "firm_branding",
      firmBranding,
      [
        "user_id",
        "logo_object_key",
        "letterhead_text",
        "custom_disclaimer_en",
        "custom_disclaimer_ar",
        "primary_color",
        "signature_block",
        "updated_at",
      ],
    ],
  ])("%s table has the expected columns", (_name, table, expected) => {
    const cols = new Set(getTableConfig(table).columns.map((c) => c.name));
    expect(cols).toEqual(new Set(expected));
  });

  it("clients.user_id cascades on user delete", () => {
    const fks = getTableConfig(clients).foreignKeys;
    expect(fks.find((fk) => fk.onDelete === "cascade")).toBeTruthy();
  });

  it("cases.client_id sets null on client delete (case survives orphaned)", () => {
    const fks = getTableConfig(cases).foreignKeys;
    const clientFk = fks.find((fk) => fk.reference().columns.some((c) => c.name === "client_id"));
    expect(clientFk?.onDelete).toBe("set null");
  });

  it("cases.gross_estate is nullable (a case may exist before the value is known)", () => {
    const col = getTableConfig(cases).columns.find((c) => c.name === "gross_estate");
    expect(col?.notNull).toBe(false);
  });

  it("cases.funeral_expenses defaults to 0", () => {
    const col = getTableConfig(cases).columns.find((c) => c.name === "funeral_expenses");
    expect(col?.default).toBe("0");
  });

  it("cases.deceased_name, subject_gender, madhhab, heirs are required", () => {
    const required = ["deceased_name", "subject_gender", "madhhab", "heirs"];
    for (const name of required) {
      const col = getTableConfig(cases).columns.find((c) => c.name === name);
      expect(col?.notNull, `${name} should be NOT NULL`).toBe(true);
    }
  });
});
