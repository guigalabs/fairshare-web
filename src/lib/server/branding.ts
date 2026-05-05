import { eq } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "./db/client";
import { firmBranding } from "./db/schema";

export const brandingPutSchema = z.object({
  letterheadText: z.string().trim().max(200).nullish(),
  customDisclaimerEn: z.string().trim().max(2000).nullish(),
  customDisclaimerAr: z.string().trim().max(2000).nullish(),
  primaryColor: z
    .string()
    .regex(/^#?[0-9a-fA-F]{6}$/)
    .nullish(),
  signatureBlock: z.string().trim().max(1000).nullish(),
});

export type BrandingPut = z.infer<typeof brandingPutSchema>;

export async function getBranding(db: DB, userId: string) {
  const rows = await db.select().from(firmBranding).where(eq(firmBranding.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function upsertBranding(db: DB, userId: string, input: BrandingPut) {
  const existing = await getBranding(db, userId);
  if (existing) {
    const [row] = await db
      .update(firmBranding)
      .set({
        letterheadText: input.letterheadText ?? null,
        customDisclaimerEn: input.customDisclaimerEn ?? null,
        customDisclaimerAr: input.customDisclaimerAr ?? null,
        primaryColor: input.primaryColor ?? null,
        signatureBlock: input.signatureBlock ?? null,
        updatedAt: new Date(),
      })
      .where(eq(firmBranding.userId, userId))
      .returning();
    return row;
  }
  const [row] = await db
    .insert(firmBranding)
    .values({
      userId,
      letterheadText: input.letterheadText ?? null,
      customDisclaimerEn: input.customDisclaimerEn ?? null,
      customDisclaimerAr: input.customDisclaimerAr ?? null,
      primaryColor: input.primaryColor ?? null,
      signatureBlock: input.signatureBlock ?? null,
    })
    .returning();
  return row;
}
