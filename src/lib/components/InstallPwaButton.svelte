<script lang="ts">
  import { onMount } from "svelte";
  import Download from "@lucide/svelte/icons/download";
  import { Button, toast } from "$lib/ui";
  import { pwa } from "$lib/pwa.svelte";
  import { t } from "$lib/i18n/index.svelte";

  onMount(() => pwa.init());

  async function onInstall() {
    const outcome = await pwa.install();
    if (outcome === "accepted") toast.show(t("pwa.installed"), "success");
    else if (outcome === "ios") {
      toast.show(t("pwa.iosHint"), "info", 6000);
    }
  }
</script>

{#if pwa.canInstall}
  <Button variant="secondary" onclick={onInstall} size="sm">
    <Download size={16} aria-hidden="true" />
    {t("settings.installPwa")}
  </Button>
{/if}
