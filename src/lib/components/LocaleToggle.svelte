<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { i18n, LOCALES, t, type Locale } from "$lib/i18n/index.svelte";
  import { stripLocale, localePath } from "$lib/i18n/url";

  // Locale lives in the URL: "/x" is English, "/ar/x" is Arabic. Picking
  // a language navigates to the equivalent URL; the in-memory state then
  // syncs via the root layout effect.
  function switchTo(target: Locale) {
    if (target === i18n.current) return;
    const enPath = stripLocale(page.url.pathname);
    const dest = localePath(enPath, target) + page.url.search + page.url.hash;
    goto(dest, { replaceState: false, keepFocus: true });
  }

  const NATIVE: Record<Locale, string> = { en: "English", ar: "العربية" };
</script>

<div class="seg" role="radiogroup" aria-label={t("ui.language")}>
  {#each LOCALES as loc (loc)}
    <label class="seg-option" class:seg-option--active={i18n.current === loc}>
      <input
        type="radio"
        name="locale"
        value={loc}
        checked={i18n.current === loc}
        onchange={() => switchTo(loc)}
      />
      <span lang={loc}>{NATIVE[loc]}</span>
    </label>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    direction: ltr;
  }
  .seg-option {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    cursor: pointer;
  }
  .seg-option + .seg-option::before {
    content: "";
    position: absolute;
    inset-inline-start: -0.0625rem;
    top: 30%;
    height: 40%;
    border-inline-start: 1px solid var(--color-border-strong);
  }
  .seg-option:hover {
    color: var(--color-text);
  }
  .seg-option--active {
    color: var(--color-text);
    font-weight: 500;
  }
  .seg-option span[lang="ar"] {
    font-family: var(--font-arabic);
  }
  .seg-option:has(input:focus-visible) {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .seg-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
</style>
