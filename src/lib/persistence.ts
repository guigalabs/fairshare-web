// Local persistence for saved calculations. Uses Dexie (IndexedDB).
// Mirrors the iOS app's SavedCalculation shape so future cross-platform
// import/export stays straightforward.

import Dexie, { type Table } from "dexie";
import type { Gender, HeirEntry, Madhhab } from "$engine";

export interface SavedCalculation {
  id?: number;
  /** Optional user-given name. */
  name: string;
  /** ISO timestamp string. */
  createdAt: string;
  updatedAt: string;
  subjectGender: Gender;
  madhhab: Madhhab;
  heirs: HeirEntry[];
}

class FairShareDB extends Dexie {
  savedCalculations!: Table<SavedCalculation, number>;

  constructor() {
    super("fairshareDB");
    this.version(1).stores({
      savedCalculations: "++id, name, createdAt, updatedAt, madhhab",
    });
  }
}

let dbRef: FairShareDB | null = null;
function db(): FairShareDB {
  if (!dbRef) dbRef = new FairShareDB();
  return dbRef;
}

export async function saveCalculation(
  input: Omit<SavedCalculation, "id" | "createdAt" | "updatedAt">,
): Promise<number> {
  const now = new Date().toISOString();
  const row: SavedCalculation = { ...input, createdAt: now, updatedAt: now };
  return db().savedCalculations.add(row);
}

export async function listCalculations(): Promise<SavedCalculation[]> {
  return db().savedCalculations.orderBy("updatedAt").reverse().toArray();
}

export async function getCalculation(id: number): Promise<SavedCalculation | undefined> {
  return db().savedCalculations.get(id);
}

export async function renameCalculation(id: number, name: string): Promise<void> {
  await db().savedCalculations.update(id, { name, updatedAt: new Date().toISOString() });
}

export async function deleteCalculation(id: number): Promise<void> {
  await db().savedCalculations.delete(id);
}

export async function exportAll(): Promise<SavedCalculation[]> {
  return listCalculations();
}

export async function importMany(rows: SavedCalculation[]): Promise<void> {
  await db().savedCalculations.bulkAdd(
    rows.map((r) => ({ ...r, id: undefined as unknown as number })),
  );
}
