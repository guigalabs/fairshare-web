import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { MADHHABS, type Gender, type HeirType, type Madhhab } from "$engine";
import type { DB } from "./db/client";
import { cases } from "./db/schema";

const heirTypeValues: readonly HeirType[] = [
  "father",
  "mother",
  "husband",
  "wife",
  "son",
  "daughter",
  "paternalGrandfather",
  "paternalGrandmother",
  "maternalGrandmother",
  "fullBrother",
  "fullSister",
  "paternalHalfBrother",
  "paternalHalfSister",
  "maternalHalfBrother",
  "maternalHalfSister",
  "sonsSon",
  "sonsDaughter",
  "fullBrothersSon",
  "paternalHalfBrothersSon",
  "fullPaternalUncle",
  "paternalHalfUncle",
  "fullPaternalUnclesSon",
  "paternalHalfUnclesSon",
];

const personSchema = z.object({
  name: z.string().trim().min(1).max(200),
  identifier: z.string().trim().max(200).nullish(),
});

export const heirEntrySchema = z
  .object({
    type: z.enum(heirTypeValues as [HeirType, ...HeirType[]]),
    count: z.int().nonnegative().max(50),
    persons: z.array(personSchema).max(50).optional(),
  })
  .refine((e) => !e.persons || e.persons.length <= e.count, "persons cannot exceed count");

const moneyStringSchema = z.string().regex(/^-?\d+(\.\d{1,2})?$/, "invalid_money");

const debtSchema = z.object({
  creditor: z.string().trim().min(1).max(200),
  amount: moneyStringSchema,
  note: z.string().trim().max(500).optional(),
});

const bequestSchema = z.object({
  beneficiary: z.string().trim().min(1).max(200),
  amount: moneyStringSchema,
  note: z.string().trim().max(500).optional(),
});

const specialFlagsSchema = z
  .object({
    mafqud: z.string().max(500).optional(),
    haml: z.string().max(500).optional(),
    hadm: z.string().max(500).optional(),
    apostate: z.string().max(500).optional(),
    qatil: z.string().max(500).optional(),
    nonMuslimHeir: z.string().max(500).optional(),
  })
  .partial();

export const caseCreateSchema = z.object({
  clientId: z.string().nullish(),
  folderId: z.string().nullish(),
  deceasedName: z.string().trim().min(1).max(200),
  dateOfDeath: z.iso.date().nullish(),
  placeOfDeath: z.string().trim().max(200).nullish(),
  jurisdiction: z.string().trim().max(200).nullish(),
  deceasedIdentifier: z.string().trim().max(200).nullish(),
  hearingDate: z.iso.date().nullish(),
  notes: z.string().max(10_000).nullish(),
  tags: z.array(z.string().trim().max(50)).max(50).default([]),
  subjectGender: z.enum(["male", "female"] as [Gender, Gender]),
  madhhab: z.enum(MADHHABS as readonly [Madhhab, ...Madhhab[]]),
  heirs: z.array(heirEntrySchema).min(1, "at_least_one_heir"),
  currency: z.string().length(3).default("USD"),
  grossEstate: moneyStringSchema.nullish(),
  funeralExpenses: moneyStringSchema.default("0"),
  debts: z.array(debtSchema).default([]),
  bequests: z.array(bequestSchema).default([]),
  specialFlags: specialFlagsSchema.default({}),
  advisoryNotes: z.string().max(20_000).nullish(),
});

/**
 * Patch-shape of caseCreateSchema, but with all `.default(...)` values
 * stripped: a PATCH body of `{}` must round-trip to `{}`, not to the
 * defaults baked into create. Without this, an empty PATCH would silently
 * overwrite tags / debts / bequests / specialFlags / currency /
 * funeralExpenses back to their initial values.
 */
export const casePatchSchema = z
  .object({
    clientId: z.string().nullish(),
    folderId: z.string().nullish(),
    deceasedName: z.string().trim().min(1).max(200).optional(),
    dateOfDeath: z.iso.date().nullish(),
    placeOfDeath: z.string().trim().max(200).nullish(),
    jurisdiction: z.string().trim().max(200).nullish(),
    deceasedIdentifier: z.string().trim().max(200).nullish(),
    hearingDate: z.iso.date().nullish(),
    notes: z.string().max(10_000).nullish(),
    tags: z.array(z.string().trim().max(50)).max(50).optional(),
    subjectGender: z.enum(["male", "female"] as [Gender, Gender]).optional(),
    madhhab: z.enum(MADHHABS as readonly [Madhhab, ...Madhhab[]]).optional(),
    heirs: z.array(heirEntrySchema).min(1, "at_least_one_heir").optional(),
    currency: z.string().length(3).optional(),
    grossEstate: moneyStringSchema.nullish(),
    funeralExpenses: moneyStringSchema.optional(),
    debts: z.array(debtSchema).optional(),
    bequests: z.array(bequestSchema).optional(),
    specialFlags: specialFlagsSchema.optional(),
    advisoryNotes: z.string().max(20_000).nullish(),
  })
  .strict();

export type CaseCreate = z.infer<typeof caseCreateSchema>;
export type CasePatch = z.infer<typeof casePatchSchema>;

export interface ListCasesOpts {
  search?: string;
  clientId?: string;
  folderId?: string;
  madhhab?: Madhhab;
  tag?: string;
  sort?: "updated_desc" | "updated_asc";
}

export async function listCases(db: DB, userId: string, opts: ListCasesOpts = {}) {
  const conditions = [eq(cases.userId, userId), isNull(cases.deletedAt)];
  if (opts.clientId) conditions.push(eq(cases.clientId, opts.clientId));
  if (opts.folderId) conditions.push(eq(cases.folderId, opts.folderId));
  if (opts.madhhab) conditions.push(eq(cases.madhhab, opts.madhhab));
  if (opts.tag) conditions.push(sql`${opts.tag} = ANY(${cases.tags})`);
  if (opts.search) {
    const like = `%${opts.search}%`;
    const search = or(ilike(cases.deceasedName, like), ilike(cases.notes, like));
    if (search) conditions.push(search);
  }
  return db
    .select()
    .from(cases)
    .where(and(...conditions))
    .orderBy(opts.sort === "updated_asc" ? asc(cases.updatedAt) : desc(cases.updatedAt));
}

export async function getCase(db: DB, userId: string, id: string) {
  const rows = await db
    .select()
    .from(cases)
    .where(and(eq(cases.id, id), eq(cases.userId, userId), isNull(cases.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createCase(db: DB, userId: string, input: CaseCreate) {
  const [row] = await db
    .insert(cases)
    .values({
      userId,
      clientId: input.clientId ?? null,
      folderId: input.folderId ?? null,
      deceasedName: input.deceasedName,
      dateOfDeath: input.dateOfDeath ?? null,
      placeOfDeath: input.placeOfDeath ?? null,
      jurisdiction: input.jurisdiction ?? null,
      deceasedIdentifier: input.deceasedIdentifier ?? null,
      hearingDate: input.hearingDate ?? null,
      notes: input.notes ?? null,
      tags: input.tags,
      subjectGender: input.subjectGender,
      madhhab: input.madhhab,
      heirs: input.heirs,
      currency: input.currency,
      grossEstate: input.grossEstate ?? null,
      funeralExpenses: input.funeralExpenses,
      debts: input.debts,
      bequests: input.bequests,
      specialFlags: input.specialFlags,
      advisoryNotes: input.advisoryNotes ?? null,
    })
    .returning();
  return row;
}

export async function patchCase(db: DB, userId: string, id: string, patch: CasePatch) {
  const update: Partial<typeof cases.$inferInsert> = { updatedAt: new Date() };
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) (update as Record<string, unknown>)[key] = value;
  }
  const [row] = await db
    .update(cases)
    .set(update)
    .where(and(eq(cases.id, id), eq(cases.userId, userId), isNull(cases.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteCase(db: DB, userId: string, id: string) {
  const [row] = await db
    .update(cases)
    .set({ deletedAt: new Date() })
    .where(and(eq(cases.id, id), eq(cases.userId, userId), isNull(cases.deletedAt)))
    .returning({ id: cases.id });
  return row != null;
}
