import { exportAll, type SavedCalculation } from "$lib/persistence";

const FLAG_KEY = "fairshare:dexie-import-status";

export type ImportStatus = "untested" | "pending" | "skipped" | "done";

export function importStatus(): ImportStatus {
  if (typeof localStorage === "undefined") return "done";
  return (localStorage.getItem(FLAG_KEY) as ImportStatus | null) ?? "untested";
}

export function setImportStatus(status: ImportStatus): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(FLAG_KEY, status);
}

export function dexieToCasePayload(local: SavedCalculation) {
  return {
    deceasedName: local.name?.trim() || "Imported scenario",
    subjectGender: local.subjectGender,
    madhhab: local.madhhab,
    heirs: local.heirs,
  };
}

export interface ImportResult {
  attempted: number;
  succeeded: number;
  failed: number;
}

/**
 * Read every locally-saved case from Dexie and POST it to /api/cases.
 * The endpoint is idempotent enough that re-runs (across devices) cause
 * duplicates — Phase 2 will add a dedupe-hash. For now, we only call
 * this once per device (the FLAG_KEY guards re-runs).
 */
export async function importLocalCases(): Promise<ImportResult> {
  const rows = await exportAll();
  let succeeded = 0;
  for (const row of rows) {
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dexieToCasePayload(row)),
    });
    if (res.ok) succeeded += 1;
  }
  return { attempted: rows.length, succeeded, failed: rows.length - succeeded };
}
