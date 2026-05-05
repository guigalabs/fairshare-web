import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "./db/client";
import { clients } from "./db/schema";

export const clientCreateSchema = z.object({
  displayName: z.string().trim().min(1, "display_name_required").max(200),
  primaryContactName: z.string().trim().max(200).nullish(),
  primaryContactEmail: z
    .email()
    .nullish()
    .or(z.literal("").transform(() => null)),
  notes: z.string().max(10_000).nullish(),
});

export const clientPatchSchema = clientCreateSchema.partial();

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientPatch = z.infer<typeof clientPatchSchema>;

export async function listClients(db: DB, userId: string) {
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.userId, userId), isNull(clients.deletedAt)))
    .orderBy(desc(clients.updatedAt));
}

export async function getClient(db: DB, userId: string, id: string) {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId), isNull(clients.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createClient(db: DB, userId: string, input: ClientCreate) {
  const [row] = await db
    .insert(clients)
    .values({
      userId,
      displayName: input.displayName,
      primaryContactName: input.primaryContactName ?? null,
      primaryContactEmail: input.primaryContactEmail ?? null,
      notes: input.notes ?? null,
    })
    .returning();
  return row;
}

export async function patchClient(db: DB, userId: string, id: string, patch: ClientPatch) {
  const update: Partial<typeof clients.$inferInsert> = { updatedAt: new Date() };
  if (patch.displayName !== undefined) update.displayName = patch.displayName;
  if (patch.primaryContactName !== undefined) update.primaryContactName = patch.primaryContactName;
  if (patch.primaryContactEmail !== undefined)
    update.primaryContactEmail = patch.primaryContactEmail;
  if (patch.notes !== undefined) update.notes = patch.notes;

  const [row] = await db
    .update(clients)
    .set(update)
    .where(and(eq(clients.id, id), eq(clients.userId, userId), isNull(clients.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteClient(db: DB, userId: string, id: string) {
  const [row] = await db
    .update(clients)
    .set({ deletedAt: new Date() })
    .where(and(eq(clients.id, id), eq(clients.userId, userId), isNull(clients.deletedAt)))
    .returning({ id: clients.id });
  return row != null;
}
