import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { accounts, sessions, users, verificationTokens } from "./schema";

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
