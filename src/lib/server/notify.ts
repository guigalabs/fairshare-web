// Emails fairshare@guigalabs.com when someone joins a waitlist. Sent via
// Cloudflare Email Sending's REST API because Pages Functions can't use the
// send_email binding.

const ACCOUNT_ID = "df300a4e84e7e48176748a4e7a51ac74";
const FROM = { address: "fairshare@notify.guigalabs.com", name: "FairShare" };
const TO = "fairshare@guigalabs.com";

const LIST_NAMES: Record<string, string> = {
  pro: "FairShare Pro",
  ios: "iPhone app",
};

export interface WaitlistSignup {
  email: string;
  source: string;
  referrer: string | null;
}

export function buildWaitlistAlert(signup: WaitlistSignup, at: Date) {
  const list = LIST_NAMES[signup.source] ?? signup.source;
  const subject = `New waitlist signup: ${signup.email} (${list})`;
  const text = [
    `${signup.email} joined the ${list} waitlist.`,
    "",
    `Came from: ${signup.referrer || "unknown"}`,
    `Time: ${at.toISOString()}`,
    "",
    "Reply to this email to write back to them.",
  ].join("\n");
  return { subject, text };
}

export async function sendWaitlistAlert(
  token: string,
  signup: WaitlistSignup,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const { subject, text } = buildWaitlistAlert(signup, new Date());
  const res = await fetcher(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/email/sending/send`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: TO, reply_to: signup.email, subject, text }),
    },
  );
  if (!res.ok) {
    throw new Error(`waitlist alert failed: ${res.status} ${await res.text()}`);
  }
}
