<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import Share2 from "@lucide/svelte/icons/share-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import Printer from "@lucide/svelte/icons/printer";
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { share, shareUrlFor } from "$lib/share";
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
      title: "FairShare result",
      text: "Islamic inheritance calculation",
      url,
    });
    if (outcome === "share") toast.show("Shared", "success");
    else if (outcome === "clipboard") toast.show("Link copied to clipboard", "success");
    else if (outcome === "cancelled") {
      // User dismissed the share sheet — respect that, no toast.
    } else toast.show("Couldn't share. Copy the URL from the address bar.", "error");
  }

  async function onExportPdf() {
    exporting = true;
    try {
      const { buildResultPdf, downloadBlob } = await import("$lib/features/pdf/exportPdf");
      const blob = await buildResultPdf({ inputCase, result });
      downloadBlob(blob, `fairshare-${Date.now()}.pdf`);
      toast.show("PDF downloaded", "success");
    } catch (err) {
      console.error(err);
      toast.show("PDF export failed", "error");
    } finally {
      exporting = false;
    }
  }
</script>

<div class="bar" role="toolbar" aria-label="Result actions">
  <Button variant="secondary" size="sm" onclick={onShare}>
    <Share2 size={16} aria-hidden="true" />
    Share
  </Button>
  <Button variant="secondary" size="sm" onclick={onExportPdf} loading={exporting}>
    <FileDown size={16} aria-hidden="true" />
    PDF
  </Button>
  <Button variant="secondary" size="sm" onclick={() => window.print()}>
    <Printer size={16} aria-hidden="true" />
    Print
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
