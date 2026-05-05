import { describe, expect, it } from "vitest";
import type { RequestEvent } from "./$types";
import { POST } from "./+server";

interface KVStore extends KVNamespace {
  store: Map<string, string>;
}

function makeKv(): KVStore {
  const store = new Map<string, string>();
  return {
    store,
    get: async (key) => store.get(key) ?? null,
    put: async (key, value) => {
      store.set(key, value);
    },
    delete: async (key) => {
      store.delete(key);
    },
  };
}

function makeEvent(body: unknown, kv: KVStore | null = makeKv()): RequestEvent {
  return {
    request: new Request("https://x/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    platform: kv ? { env: { WAITLIST_KV: kv } } : undefined,
  } as RequestEvent;
}

describe("POST /api/waitlist", () => {
  it("stores a valid email and returns ok", async () => {
    const kv = makeKv();
    const res = await POST(makeEvent({ email: "amina@firm.com" }, kv));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(kv.store.has("waitlist:amina@firm.com")).toBe(true);
    const stored = JSON.parse(kv.store.get("waitlist:amina@firm.com") ?? "{}");
    expect(stored.email).toBe("amina@firm.com");
    expect(typeof stored.createdAt).toBe("string");
  });

  it("rejects malformed email with 400", async () => {
    const kv = makeKv();
    const res = await POST(makeEvent({ email: "not-an-email" }, kv));
    expect(res.status).toBe(400);
    expect(kv.store.size).toBe(0);
  });

  it("rejects missing email with 400", async () => {
    const res = await POST(makeEvent({}));
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await POST(makeEvent("{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 503 when KV is not bound", async () => {
    const res = await POST(makeEvent({ email: "x@y.com" }, null));
    expect(res.status).toBe(503);
  });

  it("normalizes email to lowercase before storing", async () => {
    const kv = makeKv();
    await POST(makeEvent({ email: "Mixed@Case.COM" }, kv));
    expect(kv.store.has("waitlist:mixed@case.com")).toBe(true);
  });
});
