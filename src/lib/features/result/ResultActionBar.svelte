<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import Save from "@lucide/svelte/icons/save";
  import Share2 from "@lucide/svelte/icons/share-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import Printer from "@lucide/svelte/icons/printer";
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { saveCalculation } from "$lib/persistence";
  import { share, shareUrlFor } from "$lib/share";
  import { buildResultPdf, downloadBlob } from "$lib/features/pdf/exportPdf";

  interface Props {
    inputCase: InheritanceCase;
    result: CalculationResult;
  }

  let { inputCase, result }: Props = $props();

  let saving = $state(false);
  let exporting = $state(false);

  function defaultName(c: InheritanceCase): string {
    const heirSummary = c.heirs.map((h) => `${h.count}${h.type[0]}`).join(" ");
    return `${c.madhhab} · ${heirSummary}`;
  }

  async function onSave() {
    saving = true;
    try {
      const id = await saveCalculation({
        name: defaultName(inputCase),
        subjectGender: inputCase.subjectGender,
        madhhab: inputCase.madhhab,
        heirs: [...inputCase.heirs],
      });
      toast.show(`Saved (#${id})`, "success");
    } catch (err) {
      console.error(err);
      toast.show("Couldn't save — IndexedDB unavailable?", "error");
    } finally {
      saving = false;
    }
  }

  async function onShare() {
    const url = shareUrlFor(inputCase);
    const outcome = await share({
      title: "FairShare result",
      text: "Islamic inheritance calculation",
      url,
    });
    if (outcome === "share") toast.show("Shared", "success");
    else if (outcome === "clipboard") toast.show("Link copied to clipboard", "success");
    else toast.show("Couldn't share — copy URL from address bar", "error");
  }

  async function onExportPdf() {
    exporting = true;
    try {
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
  <Button variant="secondary" size="sm" onclick={onSave} loading={saving}>
    <Save size={16} aria-hidden="true" />
    Save
  </Button>
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
