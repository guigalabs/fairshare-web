<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import FileDown from "@lucide/svelte/icons/file-down";
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { t } from "$lib/i18n/index.svelte";
  // pdf-lib (~430 KB) is lazy-imported inside the click handler — /result
  // doesn't pay for it on initial load.

  interface Props {
    inputCase: InheritanceCase;
    result: CalculationResult;
  }

  let { inputCase, result }: Props = $props();

  let exporting = $state(false);

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
  <Button variant="secondary" size="sm" onclick={onExportPdf} loading={exporting}>
    <FileDown size={16} aria-hidden="true" />
    {t("result.action.downloadPdf")}
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
