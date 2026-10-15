import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { hashToken, normalizeEmail } from "./signin-code";

describe("sign-in code helpers", () => {
  it("hashes tokens exactly like Auth.js stores them", async () => {
    // Auth.js: sha256(`${token}${secret}`) as hex (lib/utils/web.js createHash).
    expect(await hashToken("042917", "s3cret")).toBe(
      createHash("sha256").update("042917s3cret").digest("hex"),
    );
  });

  it("normalizes email the way Auth.js does", () => {
    expect(normalizeEmail("  Amina@Firm.COM ")).toBe("amina@firm.com");
    expect(normalizeEmail("a@b.com,evil.com")).toBe("a@b.com");
    expect(normalizeEmail('"x"@y.com')).toBeNull();
    expect(normalizeEmail("nope")).toBeNull();
  });
});
