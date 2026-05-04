import { describe, expect, it } from "vitest";
import { verifyStripeSignature } from "./stripe";

const SECRET = "whsec_test_secret_xyz";
const NOW = new Date("2026-05-04T12:00:00Z");

async function sign(body: string, ts: number, secret = SECRET): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}.${body}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

describe("verifyStripeSignature", () => {
  it("accepts a freshly-signed payload", async () => {
    const body = '{"type":"customer.subscription.updated"}';
    const ts = Math.floor(NOW.getTime() / 1000);
    const v1 = await sign(body, ts);
    expect(
      await verifyStripeSignature({
        rawBody: body,
        signatureHeader: `t=${ts},v1=${v1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("accepts when one of multiple v1 entries matches (Stripe rotates by appending)", async () => {
    const body = "{}";
    const ts = Math.floor(NOW.getTime() / 1000);
    const valid = await sign(body, ts);
    const header = `t=${ts},v1=${"0".repeat(64)},v1=${valid}`;
    expect(
      await verifyStripeSignature({
        rawBody: body,
        signatureHeader: header,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("rejects a tampered body", async () => {
    const ts = Math.floor(NOW.getTime() / 1000);
    const v1 = await sign("{}", ts);
    expect(
      await verifyStripeSignature({
        rawBody: '{"tampered":true}',
        signatureHeader: `t=${ts},v1=${v1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects a wrong secret", async () => {
    const ts = Math.floor(NOW.getTime() / 1000);
    const v1 = await sign("{}", ts, "wrong");
    expect(
      await verifyStripeSignature({
        rawBody: "{}",
        signatureHeader: `t=${ts},v1=${v1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects timestamps outside the tolerance window", async () => {
    const tooOld = Math.floor(NOW.getTime() / 1000) - 600;
    const v1 = await sign("{}", tooOld);
    expect(
      await verifyStripeSignature({
        rawBody: "{}",
        signatureHeader: `t=${tooOld},v1=${v1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects a malformed signature header", async () => {
    expect(
      await verifyStripeSignature({
        rawBody: "{}",
        signatureHeader: "garbage",
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
    expect(
      await verifyStripeSignature({
        rawBody: "{}",
        signatureHeader: "t=abc,v1=def",
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });
});
