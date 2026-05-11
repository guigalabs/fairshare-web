import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Build a Drizzle client bound to a Cloudflare D1 database. Pass
 * `platform.env.DB` from a SvelteKit `+server.ts` or `+page.server.ts` so the
 * connection follows the request scope.
 */
export function makeDb(d1: D1Database): DB {
  return drizzle(d1, { schema });
}
