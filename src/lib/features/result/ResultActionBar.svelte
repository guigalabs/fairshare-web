<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import Save from "@lucide/svelte/icons/save";
  import Share2 from "@lucide/svelte/icons/share-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import Printer from "@lucide/svelte/icons/printer";
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { share, shareUrlFor } from "$lib/share";
  // Both pdf-lib (~430 KB) and Dexie (~50 KB) are lazy-imported inside their
  // click handlers — /result doesn't pay for them on initial load.

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
      const { saveCalculation } = await import("$lib/persistence");
      const id = await saveCalculation({
        name: defaultName(inputCase),
        subjectGender: inputCase.subjectGender,
        madhhab: inputCase.madhhab,
        heirs: [...inputCase.heirs],
      });
      toast.show(`Saved (#${id})`, "success");
      void fireConfetti();
    } catch (err) {
      console.error(err);
      toast.show("Couldn't save. IndexedDB may be unavailable.", "error");
    } finally {
      saving = false;
    }
  }

  // Suppress confetti for users who opted out of motion. The lib is dynamic-
  // imported so it never lands in the /result initial bundle.
  async function fireConfetti() {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 35,
      origin: { y: 0.3 },
      colors: ["#0a8754", "#388F9E", "#C79438", "#D95971", "#7A61B8"],
      disableForReducedMotion: true,
    });
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
    else toast.show("Couldn't share. Copy the URL from the address bar.", "error");
  }

  async function onExportPdf() {
    exporting = true;
    try {
      const { buildResultPdf, downloadBlob } = await import(
        "$lib/features/pdf/exportPdf"
      );
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
