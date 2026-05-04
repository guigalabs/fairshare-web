import { describe, expect, it } from "vitest";
import { buildMagicLinkEmail } from "./email";

describe("buildMagicLinkEmail", () => {
  const sample = buildMagicLinkEmail({
    url: "https://fairshare.guigalabs.com/auth/callback?token=abc",
    identifier: "amina@firm.com",
  });

  it("subject names the host", () => {
    expect(sample.subject).toBe("Sign in to fairshare.guigalabs.com");
  });

  it("text body includes the sign-in URL verbatim", () => {
    expect(sample.text).toContain("https://fairshare.guigalabs.com/auth/callback?token=abc");
  });

  it("text body mentions the 10-minute expiry", () => {
    expect(sample.text).toContain("10 minutes");
  });

  it("html body links the sign-in URL with proper attribute encoding", () => {
    expect(sample.html).toContain('href="https://fairshare.guigalabs.com/auth/callback?token=abc"');
  });

  it("html escapes script tags in the URL host (defense against malicious AUTH_URL)", () => {
    const evil = buildMagicLinkEmail({
      url: "https://x.com/<script>alert(1)</script>?t=1",
      identifier: "x@y.com",
    });
    expect(evil.html).not.toContain("<script>alert(1)</script>");
    expect(evil.html).toContain("&lt;script&gt;");
  });
});
