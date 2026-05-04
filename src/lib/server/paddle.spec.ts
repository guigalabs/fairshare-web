import { describe, expect, it } from "vitest";
import { verifyPaddleSignature } from "./paddle";

const SECRET = "pdl_ntfset_01_test_secret";
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
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}:${body}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

describe("verifyPaddleSignature", () => {
  it("accepts a freshly-signed payload", async () => {
    const body = '{"event_type":"subscription.updated"}';
    const ts = Math.floor(NOW.getTime() / 1000);
    const h1 = await sign(body, ts);
    expect(
      await verifyPaddleSignature({
        rawBody: body,
        signatureHeader: `ts=${ts};h1=${h1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("rejects a tampered body", async () => {
    const body = '{"event_type":"subscription.updated"}';
    const ts = Math.floor(NOW.getTime() / 1000);
    const h1 = await sign(body, ts);
    expect(
      await verifyPaddleSignature({
        rawBody: '{"event_type":"subscription.created"}',
        signatureHeader: `ts=${ts};h1=${h1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects a wrong secret", async () => {
    const body = '{"event_type":"x"}';
    const ts = Math.floor(NOW.getTime() / 1000);
    const h1 = await sign(body, ts, "wrong-secret");
    expect(
      await verifyPaddleSignature({
        rawBody: body,
        signatureHeader: `ts=${ts};h1=${h1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects timestamps outside the tolerance window", async () => {
    const body = "{}";
    const tooOld = Math.floor(NOW.getTime() / 1000) - 600;
    const h1 = await sign(body, tooOld);
    expect(
      await verifyPaddleSignature({
        rawBody: body,
        signatureHeader: `ts=${tooOld};h1=${h1}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects a malformed signature header", async () => {
    expect(
      await verifyPaddleSignature({
        rawBody: "{}",
        signatureHeader: "garbage",
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
    expect(
      await verifyPaddleSignature({
        rawBody: "{}",
        signatureHeader: "ts=abc;h1=def",
        secret: SECRET,
        now: NOW,
      }),
    ).toBe(false);
  });
});
