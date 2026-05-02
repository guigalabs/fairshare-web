<script lang="ts">
  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";
  import Monitor from "@lucide/svelte/icons/monitor";
  import { theme } from "./theme.svelte";

  const options = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "system", label: "System", Icon: Monitor },
    { value: "dark", label: "Dark", Icon: Moon },
  ] as const;
</script>

<fieldset class="seg" role="radiogroup" aria-label="Theme">
  {#each options as { value, label, Icon } (value)}
    <label class="seg-option" class:seg-option--active={theme.mode === value}>
      <input
        type="radio"
        name="theme"
        {value}
        checked={theme.mode === value}
        onchange={() => theme.set(value)}
      />
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </label>
  {/each}
</fieldset>

<style>
  .seg {
    display: inline-flex;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    padding: 0.25rem;
    background: var(--color-bg-elevated);
    gap: 0.125rem;
    margin: 0;
  }
  .seg-option {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-pill);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .seg-option:hover {
    color: var(--color-text);
  }
  .seg-option--active {
    background: var(--color-accent);
    color: #fff;
  }
  .seg-option--active:hover {
    color: #fff;
  }
  .seg-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
</style>
