import { describe, expect, it } from "vitest";
import { applySubscriptionEvent, verifyStripeSignature } from "./stripe";

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

/** Captures the values written to the subscription upsert without hitting Postgres. */
function makeFakeDb(existing: { id: string; lastEventAt?: number | null } | null) {
  const captured: { values?: Record<string, unknown>; mode?: "insert" | "update" } = {};
  const fakeDb = {
    select: () => ({
      from: () => ({
        where: () => ({ limit: async () => (existing ? [existing] : []) }),
      }),
    }),
    insert: () => ({
      values: async (v: Record<string, unknown>) => {
        captured.values = v;
        captured.mode = "insert";
      },
    }),
    update: () => ({
      set: (v: Record<string, unknown>) => ({
        where: async () => {
          captured.values = v;
          captured.mode = "update";
        },
      }),
    }),
  };
  return { fakeDb, captured };
}

describe("applySubscriptionEvent — current_period_end resolution", () => {
  const baseEvent = {
    id: "evt_test_1",
    type: "customer.subscription.updated",
    created: 1_700_000_000,
    data: {
      object: {
        id: "sub_basil_test",
        customer: "cus_test",
        status: "active",
        items: { data: [{ plan: { interval: "month" as const } }] },
        metadata: { user_id: "user_42" },
      },
    },
  };

  it("reads current_period_end from the subscription item (basil API)", async () => {
    const { fakeDb, captured } = makeFakeDb(null);
    const ts = 1_800_000_000; // 2027-01-15
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      {
        ...baseEvent,
        data: {
          object: {
            ...baseEvent.data.object,
            items: { data: [{ current_period_end: ts, plan: { interval: "month" } }] },
          },
        },
      },
    );
    expect((captured.values?.currentPeriodEnd as Date).getTime()).toBe(ts * 1000);
  });

  it("falls back to subscription.current_period_end on older API versions", async () => {
    const { fakeDb, captured } = makeFakeDb(null);
    const ts = 1_800_000_000;
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      {
        ...baseEvent,
        data: {
          object: {
            ...baseEvent.data.object,
            current_period_end: ts,
          },
        },
      } as Parameters<typeof applySubscriptionEvent>[1],
    );
    expect((captured.values?.currentPeriodEnd as Date).getTime()).toBe(ts * 1000);
  });

  it("prefers item-level over subscription-level when both are present", async () => {
    const { fakeDb, captured } = makeFakeDb(null);
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      {
        ...baseEvent,
        data: {
          object: {
            ...baseEvent.data.object,
            current_period_end: 100,
            items: {
              data: [{ current_period_end: 200, plan: { interval: "month" } }],
            },
          },
        },
      } as Parameters<typeof applySubscriptionEvent>[1],
    );
    expect((captured.values?.currentPeriodEnd as Date).getTime()).toBe(200_000);
  });

  it("writes null when neither location has the field", async () => {
    const { fakeDb, captured } = makeFakeDb(null);
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      baseEvent,
    );
    expect(captured.values?.currentPeriodEnd).toBeNull();
  });
});

describe("applySubscriptionEvent — out-of-order event guard", () => {
  const evt = (id: string, created: number, status = "active") => ({
    id,
    type: "customer.subscription.updated",
    created,
    data: {
      object: {
        id: "sub_X",
        customer: "cus_X",
        status,
        items: { data: [{ plan: { interval: "month" as const } }] },
        metadata: { user_id: "user_X" },
      },
    },
  });

  it("ignores an event whose `created` is older than the row's lastEventAt", async () => {
    const { fakeDb, captured } = makeFakeDb({ id: "row_1", lastEventAt: 2000 });
    // Stripe re-delivers an event from before the latest one we applied.
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      evt("evt_old", 1500, "canceled"),
    );
    expect(captured.mode).toBeUndefined();
  });

  it("applies an event whose `created` is newer than the row's lastEventAt", async () => {
    const { fakeDb, captured } = makeFakeDb({ id: "row_1", lastEventAt: 1000 });
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      evt("evt_new", 2000, "active"),
    );
    expect(captured.mode).toBe("update");
    expect(captured.values?.lastEventAt).toBe(2000);
  });

  it("applies on first-ever event (lastEventAt is null)", async () => {
    const { fakeDb, captured } = makeFakeDb({ id: "row_1", lastEventAt: null });
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      evt("evt_first", 1234, "active"),
    );
    expect(captured.mode).toBe("update");
  });

  it("inserts (not updates) when no row exists yet, and stamps lastEventAt", async () => {
    const { fakeDb, captured } = makeFakeDb(null);
    await applySubscriptionEvent(
      fakeDb as unknown as Parameters<typeof applySubscriptionEvent>[0],
      evt("evt_create", 5000, "active"),
    );
    expect(captured.mode).toBe("insert");
    expect(captured.values?.lastEventAt).toBe(5000);
  });
});
