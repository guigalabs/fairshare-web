<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Button, Card, EmptyState, IconButton, toast } from "$lib/ui";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Pencil from "@lucide/svelte/icons/pencil";
  import {
    listCalculations,
    deleteCalculation,
    renameCalculation,
    type SavedCalculation,
  } from "$lib/persistence";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";

  let loading = $state(true);
  let rows = $state<SavedCalculation[]>([]);
  let editingId = $state<number | null>(null);
  let editingName = $state("");

  async function refresh() {
    rows = await listCalculations();
  }

  onMount(async () => {
    try {
      await refresh();
    } finally {
      loading = false;
    }
  });

  async function open(row: SavedCalculation) {
    sessionStorage.setItem(
      "fairshare:case",
      JSON.stringify({
        subjectGender: row.subjectGender,
        madhhab: row.madhhab,
        heirs: row.heirs,
      }),
    );
    await goto("/result");
  }

  async function remove(id: number) {
    if (!confirm("Delete this calculation? This cannot be undone.")) return;
    await deleteCalculation(id);
    await refresh();
    toast.show("Deleted", "success");
  }

  function startEdit(row: SavedCalculation) {
    editingId = row.id ?? null;
    editingName = row.name;
  }

  async function commitEdit() {
    if (editingId === null) return;
    await renameCalculation(editingId, editingName.trim() || "Untitled");
    editingId = null;
    editingName = "";
    await refresh();
  }

  function cancelEdit() {
    editingId = null;
    editingName = "";
  }
</script>

<svelte:head>
  <title>Saved — FairShare</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <header class="head">
    <h1>Saved calculations</h1>
    <p>All saved calculations live on this device. Clear your browser storage to remove them.</p>
  </header>

  {#if loading}
    <p class="hint">Loading…</p>
  {:else if rows.length === 0}
    <EmptyState
      title="No saved calculations yet"
      description="Run a calculation and tap Save to keep it here for later."
    >
      {#snippet action()}
        <Button href="/calculate" size="lg">Start a calculation</Button>
      {/snippet}
    </EmptyState>
  {:else}
    <ul class="list">
      {#each rows as row (row.id)}
        <li>
          <Card>
            {#snippet children()}
              <div class="row">
                <div class="row-text">
                  {#if editingId === row.id}
                    <input
                      class="rename"
                      bind:value={editingName}
                      onkeydown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  {:else}
                    <button type="button" class="row-name" onclick={() => open(row)}>
                      {row.name}
                    </button>
                  {/if}
                  <p class="row-meta">
                    {row.madhhab} · {row.subjectGender}
                    · {new Date(row.updatedAt).toLocaleDateString("en")}
                  </p>
                  <p class="row-heirs">
                    {row.heirs.map((h) => labelFor(h.type, h.count)).join(" · ")}
                  </p>
                </div>
                <div class="row-actions">
                  {#if editingId === row.id}
                    <Button size="sm" onclick={commitEdit}>Save</Button>
                    <Button size="sm" variant="ghost" onclick={cancelEdit}>Cancel</Button>
                  {:else}
                    <IconButton label="Rename" onclick={() => startEdit(row)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton label="Delete" onclick={() => row.id && remove(row.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  {/if}
                </div>
              </div>
            {/snippet}
          </Card>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 1.5rem;
  }
  .head h1 {
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .head p {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
  }
  .row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .row-name {
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-align: start;
  }
  .row-name:hover {
    color: var(--color-accent);
  }
  .rename {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0.375rem 0.5rem;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
  }
  .row-meta {
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-transform: capitalize;
  }
  .row-heirs {
    margin-top: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .row-actions {
    display: flex;
    gap: 0.25rem;
  }
  .hint {
    color: var(--color-text-muted);
    text-align: center;
    padding: 2rem 0;
  }
</style>
