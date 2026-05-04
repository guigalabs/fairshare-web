<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { Button } from "$lib/ui";
  import { listCalculations } from "$lib/persistence";
  import {
    importLocalCases,
    importStatus,
    setImportStatus,
    type ImportStatus,
  } from "./dexieImport";

  let visible = $state(false);
  let count = $state(0);
  let status: ImportStatus = $state("untested");
  let busy = $state(false);
  let result = $state<{ succeeded: number; failed: number } | null>(null);

  $effect(() => {
    void check();
  });

  async function check() {
    status = importStatus();
    if (status !== "untested") {
      visible = false;
      return;
    }
    try {
      const rows = await listCalculations();
      count = rows.length;
      visible = count > 0;
    } catch {
      visible = false;
    }
  }

  async function onImport() {
    if (busy) return;
    busy = true;
    try {
      const r = await importLocalCases();
      result = { succeeded: r.succeeded, failed: r.failed };
      setImportStatus("done");
      await invalidateAll();
    } finally {
      busy = false;
      visible = false;
    }
  }

  function onSkip() {
    setImportStatus("skipped");
    visible = false;
  }
</script>

{#if visible}
  <div class="prompt" role="dialog" aria-labelledby="prompt-title">
    <div class="prompt-body">
      <h2 id="prompt-title">Import your saved scenarios?</h2>
      <p>
        We found <strong>{count}</strong>
        scenario{count === 1 ? "" : "s"} saved on this device. Import {count === 1 ? "it" : "them"} into
        your account so you can access from any device.
      </p>
      <div class="prompt-actions">
        <Button onclick={onImport} loading={busy}>Import {count}</Button>
        <Button variant="ghost" onclick={onSkip}>Don't import</Button>
      </div>
    </div>
  </div>
{/if}

{#if result}
  <p class="status" role="status">
    Imported {result.succeeded} of {result.succeeded + result.failed} scenario{result.succeeded +
      result.failed ===
    1
      ? ""
      : "s"}.
  </p>
{/if}

<style>
  .prompt {
    border: 1px solid var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 6%, var(--color-bg-elevated));
    border-radius: var(--radius-md);
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
  }
  .prompt-body h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .prompt-body p {
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }
  .prompt-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.75rem;
  }
  .status {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
</style>
