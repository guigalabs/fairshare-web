<script lang="ts">
  import { onMount } from "svelte";
  import Download from "@lucide/svelte/icons/download";
  import { Button, toast } from "$lib/ui";
  import { pwa } from "$lib/pwa.svelte";

  onMount(() => pwa.init());

  async function onInstall() {
    const outcome = await pwa.install();
    if (outcome === "accepted") toast.show("Installed", "success");
    else if (outcome === "ios") {
      toast.show("Tap Share → Add to Home Screen to install", "info", 6000);
    }
  }
</script>

{#if pwa.canInstall}
  <Button variant="secondary" onclick={onInstall} size="sm">
    <Download size={16} aria-hidden="true" />
    Install app
  </Button>
{/if}
