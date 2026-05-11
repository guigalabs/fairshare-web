import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import Resend from "@auth/sveltekit/providers/resend";
import { Resend as ResendClient } from "resend";

import { makeDb } from "./db/client";
import * as schema from "./db/schema";
import { buildMagicLinkEmail } from "./email";

// Module-level cache. The SvelteKitAuth callback fires on every request, so
// hoisting the ResendClient out avoids reconstructing its HTTP plumbing each
// time. Cloudflare Workers reuse module state across requests within an
// isolate, so this is safe and the standard pattern.
let resendCache: ResendClient | undefined;

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  const env = event.platform?.env;
  if (!env) {
    throw new Error("Cloudflare platform env missing — adapter-cloudflare must be active.");
  }

  const db = makeDb(env.DB);
  resendCache ??= new ResendClient(env.RESEND_API_KEY);
  const resend = resendCache;

  return {
    adapter: DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
    secret: env.AUTH_SECRET,
    trustHost: true,
    pages: {
      signIn: "/login",
      verifyRequest: "/login/verify",
    },
    providers: [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      Resend({
        from: env.AUTH_EMAIL_FROM,
        sendVerificationRequest: async ({ identifier, url }) => {
          const email = buildMagicLinkEmail({ url, identifier });
          const result = await resend.emails.send({
            from: env.AUTH_EMAIL_FROM,
            to: identifier,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
          if (result.error) throw new Error(result.error.message);
        },
      }),
    ],
  };
});
