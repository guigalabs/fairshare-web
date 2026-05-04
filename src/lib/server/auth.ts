import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Resend from "@auth/sveltekit/providers/resend";
import { Resend as ResendClient } from "resend";

import { makeDb } from "./db/client";
import * as schema from "./db/schema";
import { buildMagicLinkEmail } from "./email";

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  const env = event.platform?.env;
  if (!env) {
    throw new Error("Cloudflare platform env missing — adapter-cloudflare must be active.");
  }

  const db = makeDb(env.DATABASE_URL);
  const resend = new ResendClient(env.RESEND_API_KEY);

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
