// Reactive store that holds a calculation in progress on the /result page.
// Reads the InheritanceCase from sessionStorage (set by /calculate) OR from
// the ?case= URL parameter (shareable links). What-If toggles let the user
// enable/disable heirs and recompute live without losing the original input.

import { browser } from "$app/environment";
import { calculate, type CalculationResult, type HeirEntry, type HeirType, type InheritanceCase } from "$engine";
import { decodeCase } from "$lib/share";

const STORAGE_KEY = "fairshare:case";

function readStoredCase(): InheritanceCase | null {
  if (!browser) return null;
  // URL takes precedence so shareable links just work.
  const params = new URLSearchParams(window.location.search);
  const token = params.get("case");
  if (token) {
    const fromUrl = decodeCase(token);
    if (fromUrl) return fromUrl;
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InheritanceCase;
    if (!parsed.heirs || !Array.isArray(parsed.heirs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export class ResultStore {
  // Original case (URL or sessionStorage). Never mutated.
  baseCase = $state<InheritanceCase | null>(null);
  // Set of heir types the user has toggled OFF in what-if mode.
  disabled = $state<Set<HeirType>>(new Set());

  // Derived: case with disabled heirs filtered out.
  effectiveCase: InheritanceCase | null = $derived.by(() => {
    if (!this.baseCase) return null;
    if (this.disabled.size === 0) return this.baseCase;
    return {
      ...this.baseCase,
      heirs: this.baseCase.heirs.filter((h) => !this.disabled.has(h.type)),
    };
  });

  result: CalculationResult | null = $derived.by(() => {
    if (!this.effectiveCase) return null;
    return calculate(this.effectiveCase);
  });

  whatIfActive = $derived(this.disabled.size > 0);

  load(): void {
    this.baseCase = readStoredCase();
    this.disabled = new Set();
  }

  toggle(type: HeirType): void {
    const next = new Set(this.disabled);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    this.disabled = next;
  }

  clearWhatIf(): void {
    this.disabled = new Set();
  }

  isDisabled(type: HeirType): boolean {
    return this.disabled.has(type);
  }

  /** All heirs from the base case (used to render disabled rows in the UI). */
  get allHeirs(): readonly HeirEntry[] {
    return this.baseCase?.heirs ?? [];
  }
}
