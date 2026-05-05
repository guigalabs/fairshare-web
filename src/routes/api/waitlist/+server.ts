import { json, type RequestHandler } from "@sveltejs/kit";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(error: string): Response {
  return json({ ok: false, error }, { status: 400 });
}

export const POST: RequestHandler = async ({ request, platform }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  const raw = (body as { email?: unknown } | null)?.email;
  if (typeof raw !== "string" || !EMAIL_RE.test(raw)) return badRequest("invalid_email");

  const kv = platform?.env?.WAITLIST_KV;
  if (!kv) return json({ ok: false, error: "kv_not_configured" }, { status: 503 });

  const email = raw.toLowerCase();
  await kv.put(`waitlist:${email}`, JSON.stringify({ email, createdAt: new Date().toISOString() }));
  return json({ ok: true });
};
