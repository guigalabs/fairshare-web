<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Card, ThemeToggle, toast } from "$lib/ui";
  import LocaleToggle from "$lib/components/LocaleToggle.svelte";
  import InstallPwaButton from "$lib/components/InstallPwaButton.svelte";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import { exportAll, listCalculations } from "$lib/persistence";

  let savedCount = $state(0);

  async function refresh() {
    savedCount = (await listCalculations()).length;
  }

  onMount(refresh);

  async function exportJson() {
    try {
      const rows = await exportAll();
      const blob = new Blob([JSON.stringify(rows, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fairshare-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.show("Data exported", "success");
    } catch (err) {
      console.error(err);
      toast.show("Export failed", "error");
    }
  }

  async function clearAll() {
    if (
      !confirm(
        "Delete ALL saved calculations and reset preferences on this device? This cannot be undone.",
      )
    ) {
      return;
    }
    // Wipe IndexedDB + localStorage scoped to FairShare.
    indexedDB.deleteDatabase("fairshareDB");
    Object.keys(localStorage)
      .filter((k) => k.startsWith("fairshare:"))
      .forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem("fairshare:case");
    await refresh();
    toast.show("All local data cleared", "success");
  }
</script>

<svelte:head>
  <title>Settings — FairShare</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">Settings</p>
    <h1>Settings</h1>
    <p class="lede">All preferences are stored on this device only.</p>
  </header>

  <div class="grid">
    <Card>
      {#snippet children()}
        <h2>Appearance</h2>
        <div class="row"><span>Theme</span><ThemeToggle /></div>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <h2>Language</h2>
        <div class="row"><span>Interface</span><LocaleToggle /></div>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <h2>Install as app</h2>
        <p class="desc">
          Adds FairShare to your home screen for offline use. The calculator works fully offline
          once installed.
        </p>
        <div class="install"><InstallPwaButton /></div>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <h2>Your data</h2>
        <p class="desc">
          {savedCount} saved calculation{savedCount === 1 ? "" : "s"} on this device.
          Everything is local — nothing is uploaded.
        </p>
        <div class="data-actions">
          <Button variant="secondary" onclick={exportJson} size="sm">
            <FileDown size={16} aria-hidden="true" />
            Export all (JSON)
          </Button>
          <Button variant="destructive" onclick={clearAll} size="sm">
            <Trash2 size={16} aria-hidden="true" />
            Clear all data
          </Button>
        </div>
      {/snippet}
    </Card>
  </div>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 2rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .lede {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
  }
  .grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.75rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  .desc {
    color: var(--color-text-muted);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .install,
  .data-actions {
    margin-top: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
