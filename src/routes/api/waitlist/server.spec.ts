import { afterEach, describe, expect, it, vi } from "vitest";

// Mock the drizzle client before importing the handler. The handler only
// chains insert().values().onConflictDoNothing(), so the mock captures the
// values passed in and asserts on them. Returns this from each link.
interface Captured {
  email: string;
  source: string;
  referrer: string | null;
}
const captured: Captured[] = [];
// Set to false to simulate a repeat signup (ON CONFLICT DO NOTHING inserts nothing).
let insertsRow = true;
const alerts: Array<{ token: string; signup: Captured }> = [];
let alertFails = false;

vi.mock("$lib/server/db/client", () => ({
  makeDb: () => ({
    insert: () => ({
      values: (row: Captured) => {
        captured.push(row);
        return {
          onConflictDoNothing: () => ({
            returning: () => Promise.resolve(insertsRow ? [{ id: "row" }] : []),
          }),
        };
      },
    }),
  }),
}));

vi.mock("$lib/server/notify", () => ({
  sendWaitlistAlert: (token: string, signup: Captured) => {
    alerts.push({ token, signup });
    return alertFails ? Promise.reject(new Error("send failed")) : Promise.resolve();
  },
}));

import type { RequestEvent } from "./$types";
import { POST } from "./+server";

const waited: Promise<unknown>[] = [];

function makeEvent(body: unknown, env: Record<string, unknown> = {}): RequestEvent {
  return {
    request: new Request("https://x/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    platform: {
      env: { DB: {} as D1Database, ...env },
      context: { waitUntil: (p: Promise<unknown>) => waited.push(p) },
    },
  } as unknown as RequestEvent;
}

function makeUnboundEvent(body: unknown): RequestEvent {
  return {
    request: new Request("https://x/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    platform: undefined,
  } as RequestEvent;
}

afterEach(() => {
  captured.length = 0;
  alerts.length = 0;
  waited.length = 0;
  insertsRow = true;
  alertFails = false;
});

describe("POST /api/waitlist", () => {
  it("stores a valid email and returns ok", async () => {
    const res = await POST(makeEvent({ email: "amina@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(captured).toHaveLength(1);
    expect(captured[0].email).toBe("amina@example.com");
    expect(captured[0].source).toBe("pro");
  });

  it("accepts an ios source", async () => {
    await POST(makeEvent({ email: "x@y.com", source: "ios" }));
    expect(captured[0].source).toBe("ios");
  });

  it("falls back to pro for unknown sources", async () => {
    await POST(makeEvent({ email: "x@y.com", source: "made-up" }));
    expect(captured[0].source).toBe("pro");
  });

  it("captures referrer when provided and truncates long values", async () => {
    await POST(makeEvent({ email: "x@y.com", referrer: "https://example.com/blog" }));
    expect(captured[0].referrer).toBe("https://example.com/blog");

    const long = "https://x/" + "a".repeat(2000);
    await POST(makeEvent({ email: "x2@y.com", referrer: long }));
    expect(captured[1].referrer?.length).toBe(500);
  });

  it("normalizes email to lowercase", async () => {
    await POST(makeEvent({ email: "Mixed@Case.COM" }));
    expect(captured[0].email).toBe("mixed@case.com");
  });

  it("rejects malformed email with 400", async () => {
    const res = await POST(makeEvent({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(captured).toHaveLength(0);
  });

  it("rejects missing email with 400", async () => {
    const res = await POST(makeEvent({}));
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await POST(makeEvent("{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 503 when the database isn't configured", async () => {
    const res = await POST(makeUnboundEvent({ email: "x@y.com" }));
    expect(res.status).toBe(503);
  });

  it("emails an alert for a new signup when the token is set", async () => {
    const res = await POST(
      makeEvent({ email: "Amina@Example.com", source: "ios" }, { CF_EMAIL_SEND_TOKEN: "tok" }),
    );
    expect(res.status).toBe(200);
    expect(alerts).toEqual([
      { token: "tok", signup: { email: "amina@example.com", source: "ios", referrer: null } },
    ]);
    expect(waited).toHaveLength(1);
  });

  it("doesn't alert on a repeat signup", async () => {
    insertsRow = false;
    await POST(makeEvent({ email: "x@y.com" }, { CF_EMAIL_SEND_TOKEN: "tok" }));
    expect(alerts).toHaveLength(0);
  });

  it("doesn't alert when the token isn't configured", async () => {
    await POST(makeEvent({ email: "x@y.com" }));
    expect(alerts).toHaveLength(0);
  });

  it("still returns ok when the alert fails to send", async () => {
    alertFails = true;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeEvent({ email: "x@y.com" }, { CF_EMAIL_SEND_TOKEN: "tok" }));
    expect(await res.json()).toEqual({ ok: true });
    await Promise.all(waited);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
