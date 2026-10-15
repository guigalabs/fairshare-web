import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import Resend from "@auth/sveltekit/providers/resend";

import { makeDb } from "./db/client";
import * as schema from "./db/schema";
import { buildSignInCodeEmail, newSignInCode } from "./email";
import { sendSignInCode } from "./notify";

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  const env = event.platform?.env;
  if (!env) {
    throw new Error("Cloudflare platform env missing, adapter-cloudflare must be active.");
  }

  const db = makeDb(env.DB);

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
      // Email code only: a 6-digit code typed on /login/verify, no links, no passwords.
      // The Resend provider is only Auth.js's email-provider shape here; mail goes out
      // through Cloudflare Email Sending.
      Resend({
        maxAge: 10 * 60,
        generateVerificationToken: newSignInCode,
        sendVerificationRequest: async ({ identifier, token, url }) => {
          if (!env.CF_EMAIL_SEND_TOKEN) throw new Error("CF_EMAIL_SEND_TOKEN is not set");
          const email = buildSignInCodeEmail({ code: token, host: new URL(url).host });
          await sendSignInCode(env.CF_EMAIL_SEND_TOKEN, identifier, email);
        },
      }),
    ],
  };
});
