<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import Share2 from "@lucide/svelte/icons/share-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import Printer from "@lucide/svelte/icons/printer";
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { share, shareUrlFor } from "$lib/share";
  import { t } from "$lib/i18n/index.svelte";
  // pdf-lib (~430 KB) is lazy-imported inside its click handler — /result
  // doesn't pay for it on initial load.

  interface Props {
    inputCase: InheritanceCase;
    result: CalculationResult;
  }

  let { inputCase, result }: Props = $props();

  let exporting = $state(false);

  async function onShare() {
    const url = shareUrlFor(inputCase);
    const outcome = await share({
      title: t("result.share.title"),
      text: t("result.share.text"),
      url,
    });
    if (outcome === "share") toast.show(t("result.toast.shared"), "success");
    else if (outcome === "clipboard") toast.show(t("result.toast.copied"), "success");
    else if (outcome === "cancelled") {
      // User dismissed the share sheet — respect that, no toast.
    } else toast.show(t("result.toast.shareError"), "error");
  }

  async function onExportPdf() {
    exporting = true;
    try {
      const { buildResultPdf, downloadBlob } = await import("$lib/features/pdf/exportPdf");
      const blob = await buildResultPdf({ inputCase, result });
      downloadBlob(blob, `fairshare-${Date.now()}.pdf`);
      toast.show(t("result.toast.pdfDownloaded"), "success");
    } catch (err) {
      console.error(err);
      toast.show(t("result.toast.pdfError"), "error");
    } finally {
      exporting = false;
    }
  }
</script>

<div class="bar" role="toolbar" aria-label={t("result.actions.aria")}>
  <Button variant="secondary" size="sm" onclick={onShare}>
    <Share2 size={16} aria-hidden="true" />
    {t("result.action.share")}
  </Button>
  <Button variant="secondary" size="sm" onclick={onExportPdf} loading={exporting}>
    <FileDown size={16} aria-hidden="true" />
    {t("result.action.pdf")}
  </Button>
  <Button variant="secondary" size="sm" onclick={() => window.print()}>
    <Printer size={16} aria-hidden="true" />
    {t("result.action.print")}
  </Button>
</div>

<style>
  .bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  @media print {
    .bar {
      display: none;
    }
  }
</style>
