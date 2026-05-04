// See https://svelte.dev/docs/kit/types#app.d.ts

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/svelte" />

import type { Session } from "@auth/sveltekit";

declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
  }

  namespace App {
    // interface Error {}
    interface Locals {
      auth: () => Promise<Session | null>;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        WAITLIST_KV: KVNamespace;
        DATABASE_URL: string;
        AUTH_SECRET: string;
        RESEND_API_KEY: string;
        AUTH_EMAIL_FROM: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        PADDLE_WEBHOOK_SECRET: string;
        PADDLE_PUBLIC_TOKEN: string;
        PADDLE_PRICE_ID_MONTHLY: string;
        PADDLE_PRICE_ID_ANNUAL: string;
      };
    }
  }
}

export {};
