<script lang="ts">
  import { HEIR_TYPES, type HeirEntry as EngineHeirEntry, type HeirType } from "$engine";
  import { Button, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Plus from "@lucide/svelte/icons/plus";

  export interface CaseHeirEntry extends EngineHeirEntry {
    persons?: { name: string; identifier?: string | null }[];
  }

  let { value = $bindable() }: { value: CaseHeirEntry[] } = $props();

  function addRow() {
    value = [...value, { type: "wife" as HeirType, count: 1, persons: [] }];
  }
  function removeRow(idx: number) {
    value = value.filter((_, i) => i !== idx);
  }
  function setType(idx: number, t: HeirType) {
    value = value.map((row, i) => (i === idx ? { ...row, type: t } : row));
  }
  function setCount(idx: number, c: number) {
    const safe = Math.max(0, Math.min(50, c));
    value = value.map((row, i) =>
      i === idx ? { ...row, count: safe, persons: (row.persons ?? []).slice(0, safe) } : row,
    );
  }
  function addPerson(idx: number) {
    value = value.map((row, i) =>
      i === idx ? { ...row, persons: [...(row.persons ?? []), { name: "" }] } : row,
    );
  }
  function setPersonName(idx: number, pIdx: number, name: string) {
    value = value.map((row, i) =>
      i === idx
        ? {
            ...row,
            persons: (row.persons ?? []).map((p, j) => (j === pIdx ? { ...p, name } : p)),
          }
        : row,
    );
  }
  function removePerson(idx: number, pIdx: number) {
    value = value.map((row, i) =>
      i === idx ? { ...row, persons: (row.persons ?? []).filter((_, j) => j !== pIdx) } : row,
    );
  }
</script>

<div class="heirs">
  {#each value as row, idx (idx)}
    <fieldset class="row">
      <legend class="row-legend">{t("app.heir.legend", { idx: idx + 1 })}</legend>
      <div class="row-main">
        <select
          aria-label={t("app.heir.type")}
          value={row.type}
          onchange={(e) => setType(idx, (e.target as HTMLSelectElement).value as HeirType)}
        >
          {#each HEIR_TYPES as ht (ht)}
            <option value={ht}>{t(`heir.${ht}`)}</option>
          {/each}
        </select>
        <input
          type="number"
          min="0"
          max="50"
          aria-label={t("app.heir.count")}
          value={row.count}
          oninput={(e) => setCount(idx, Number((e.target as HTMLInputElement).value))}
        />
        <button
          type="button"
          class="icon-btn"
          aria-label={t("app.heir.remove")}
          onclick={() => removeRow(idx)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      {#if row.count > 0}
        <details class="persons">
          <summary>
            {t("app.heir.namesSummary", {
              filled: row.persons?.length ?? 0,
              total: row.count,
            })}
          </summary>
          <div class="person-list">
            {#each row.persons ?? [] as p, pIdx (pIdx)}
              <div class="person-row">
                <TextInput
                  placeholder={t("app.heir.fullName")}
                  value={p.name}
                  oninput={(e) => setPersonName(idx, pIdx, (e.target as HTMLInputElement).value)}
                />
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={t("app.heir.removeName")}
                  onclick={() => removePerson(idx, pIdx)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            {/each}
            {#if (row.persons?.length ?? 0) < row.count}
              <Button type="button" variant="ghost" size="sm" onclick={() => addPerson(idx)}>
                <Plus size={14} aria-hidden="true" />
                {t("app.heir.addName")}
              </Button>
            {/if}
          </div>
        </details>
      {/if}
    </fieldset>
  {/each}

  <Button type="button" variant="secondary" onclick={addRow}>
    <Plus size={16} aria-hidden="true" />
    {t("app.heir.addHeir")}
  </Button>
</div>

<style>
  .heirs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .row {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
    background: var(--color-bg-elevated);
  }
  .row-legend {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0 0.25rem;
  }
  .row-main {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
  }
  .row-main select,
  .row-main input[type="number"] {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .icon-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.5rem;
    cursor: pointer;
    color: var(--color-text-muted);
  }
  .icon-btn:hover {
    color: var(--color-error);
    border-color: var(--color-error);
  }
  .persons {
    margin-top: 0.75rem;
  }
  .persons summary {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    cursor: pointer;
  }
  .person-list {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .person-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    align-items: center;
  }
</style>
