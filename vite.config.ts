import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    SvelteKitPWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      manifest: {
        name: "FairShare: Islamic Inheritance Calculator",
        short_name: "FairShare",
        description:
          "Calculate Fara'id (Islamic inheritance) shares with confidence. Five madhabs, full Quranic citations, bilingual EN/AR. Free, offline-first.",
        theme_color: "#0E7C4A",
        background_color: "#FAFAFA",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/pwa-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2,ico,png}"],
        // SSR routes (Pro app, auth, API) must always hit the network so
        // the user gets fresh entitlement state and signed-in markup.
        // Without this denylist, Workbox's default navigation handler
        // serves the precached HTML shell for these paths and bypasses
        // the auth guard entirely.
        navigateFallbackDenylist: [/^\/app\//, /^\/api\//, /^\/login/, /^\/auth\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/methodology/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "methodology",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
