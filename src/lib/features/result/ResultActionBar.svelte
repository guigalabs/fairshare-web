<script lang="ts">
  import { Button, toast } from "$lib/ui";
  import Save from "@lucide/svelte/icons/save";
  import Share2 from "@lucide/svelte/icons/share-2";
  import FileDown from "@lucide/svelte/icons/file-down";
  import Printer from "@lucide/svelte/icons/printer";

  // Real implementations land in B6. The buttons exist now so the layout is
  // stable and the result page can be navigated end to end.

  function notImplemented(name: string) {
    return () => toast.show(`${name} coming in next phase`, "info");
  }
</script>

<div class="bar" role="toolbar" aria-label="Result actions">
  <Button variant="secondary" size="sm" onclick={notImplemented("Save")}>
    <Save size={16} aria-hidden="true" />
    Save
  </Button>
  <Button variant="secondary" size="sm" onclick={notImplemented("Share")}>
    <Share2 size={16} aria-hidden="true" />
    Share
  </Button>
  <Button variant="secondary" size="sm" onclick={notImplemented("Export PDF")}>
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
