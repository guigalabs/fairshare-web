// See https://svelte.dev/docs/kit/types#app.d.ts

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="@cloudflare/workers-types" />

import type { Session } from "@auth/sveltekit";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: () => Promise<Session | null>;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        DB: D1Database;
        AUTH_SECRET: string;
        RESEND_API_KEY: string;
        AUTH_EMAIL_FROM: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        STRIPE_SECRET_KEY: string;
        STRIPE_PUBLISHABLE_KEY: string;
        STRIPE_WEBHOOK_SECRET: string;
        STRIPE_PRICE_ID_MONTHLY: string;
        STRIPE_PRICE_ID_ANNUAL: string;
      };
    }
  }
}

export {};
