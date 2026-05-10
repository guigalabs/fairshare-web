<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Card, toast } from "$lib/ui";
  import LocaleToggle from "$lib/components/LocaleToggle.svelte";
  import InstallPwaButton from "$lib/components/InstallPwaButton.svelte";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import { exportAll, listCalculations } from "$lib/persistence";
  import { t } from "$lib/i18n/index.svelte";

  let savedCount = $state(0);
  let clearing = $state(false);

  async function refresh() {
    savedCount = (await listCalculations()).length;
  }

  onMount(async () => {
    try {
      await refresh();
    } catch {
      toast.show(t("settings.toast.readError"), "error", 6000);
    }
  });

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
      toast.show(t("settings.toast.exportSuccess"), "success");
    } catch (err) {
      console.error(err);
      toast.show(t("settings.toast.exportError"), "error");
    }
  }

  async function clearAll() {
    if (clearing) return;
    if (!confirm(t("settings.confirmClear"))) return;
    clearing = true;
    try {
      // Wipe IndexedDB + localStorage scoped to FairShare.
      indexedDB.deleteDatabase("fairshareDB");
      Object.keys(localStorage)
        .filter((k) => k.startsWith("fairshare:"))
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.removeItem("fairshare:case");
      await refresh();
      toast.show(t("settings.toast.clearSuccess"), "success");
    } catch (err) {
      console.error(err);
      toast.show(t("settings.toast.clearError"), "error");
    } finally {
      clearing = false;
    }
  }
</script>

<svelte:head>
  <title>{t("settings.title")} · FairShare</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">{t("settings.title")}</p>
    <h1>{t("settings.title")}</h1>
    <p class="lede">{t("settings.lede")}</p>
  </header>

  <div class="grid">
    <Card>
      {#snippet children()}
        <h2>{t("settings.language")}</h2>
        <div class="row">
          <span>{t("settings.language.interface")}</span><LocaleToggle />
        </div>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <h2>{t("settings.install")}</h2>
        <p class="desc">{t("settings.install.desc")}</p>
        <div class="install"><InstallPwaButton /></div>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <h2>{t("settings.data")}</h2>
        <p class="desc">
          {savedCount === 1
            ? t("settings.data.desc.one", { count: savedCount })
            : t("settings.data.desc.other", { count: savedCount })}
        </p>
        <div class="data-actions">
          <Button variant="secondary" onclick={exportJson} size="sm">
            <FileDown size={16} aria-hidden="true" />
            {t("settings.data.export")}
          </Button>
          <Button variant="destructive" onclick={clearAll} size="sm" loading={clearing}>
            <Trash2 size={16} aria-hidden="true" />
            {t("settings.data.clear")}
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
