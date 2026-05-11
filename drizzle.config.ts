import { defineConfig } from "drizzle-kit";

/**
 * Local migration generation runs from the schema file alone — no DB
 * credentials needed. Applying migrations against the live D1 database
 * happens via `wrangler d1 migrations apply` (authenticates with your
 * Cloudflare OAuth token rather than a connection string).
 */
export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  strict: true,
  verbose: true,
});
