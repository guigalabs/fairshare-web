import { describe, expect, it } from "vitest";
import { buildSignInCodeEmail, isSignInCode, newSignInCode } from "./email";

describe("buildSignInCodeEmail", () => {
  const sample = buildSignInCodeEmail({ code: "042917", host: "fairshare.guigalabs.com" });

  it("puts the code in the subject so it shows in the inbox list", () => {
    expect(sample.subject).toContain("042917");
  });

  it("text body has the code and the 10-minute expiry", () => {
    expect(sample.text).toContain("042917");
    expect(sample.text).toContain("10 minutes");
  });

  it("html body shows the code and no sign-in link", () => {
    expect(sample.html).toContain("042917");
    expect(sample.html).not.toContain("href=");
  });

  it("html escapes the host", () => {
    const evil = buildSignInCodeEmail({ code: "000000", host: "<script>alert(1)</script>" });
    expect(evil.html).not.toContain("<script>alert(1)</script>");
    expect(evil.html).toContain("&lt;script&gt;");
  });
});

describe("sign-in codes", () => {
  it("are always six digits", () => {
    for (let i = 0; i < 500; i++) expect(isSignInCode(newSignInCode())).toBe(true);
  });

  it("reject anything else", () => {
    expect(isSignInCode("12345")).toBe(false);
    expect(isSignInCode("1234567")).toBe(false);
    expect(isSignInCode("12a456")).toBe(false);
  });
});
