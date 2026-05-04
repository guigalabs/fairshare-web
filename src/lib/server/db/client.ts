import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Build a Drizzle client bound to the Neon HTTP driver. Pass
 * `platform.env.DATABASE_URL` from a SvelteKit `+server.ts` or
 * `+page.server.ts` so the connection follows the request scope.
 */
export function makeDb(databaseUrl: string): DB {
  return drizzle(neon(databaseUrl), { schema });
}
