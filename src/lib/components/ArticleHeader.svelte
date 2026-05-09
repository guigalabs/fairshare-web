<script lang="ts">
  let {
    kicker,
    title,
    lede,
    align = "left",
  }: {
    kicker: string;
    title: string;
    lede?: string;
    align?: "left" | "center";
  } = $props();
</script>

<header class="head" class:center={align === "center"}>
  <p class="kicker">{kicker}</p>
  <h1>{title}</h1>
  {#if lede}
    <p class="lede">{lede}</p>
  {/if}
</header>

<style>
  .head {
    margin-bottom: 2rem;
    max-width: 38rem;
  }
  .head.center {
    text-align: center;
    max-width: none;
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
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .head.center .lede {
    margin-inline: auto;
    max-width: 36rem;
  }
</style>
