<script lang="ts">
  import { page } from "$app/state";
  import Calculator from "@lucide/svelte/icons/calculator";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import { ThemeToggle } from "$lib/ui";

  const path = $derived(page.url.pathname.replace(/\/$/, "") || "/");
  const isCalc = $derived(path === "/calculate" || path.startsWith("/calculate/"));
  const isMethodology = $derived(path.startsWith("/methodology"));
  const isSaved = $derived(path === "/saved");
</script>

<header class="topnav">
  <div class="topnav-inner">
    <a href="/" class="brand" aria-label="FairShare home">
      <span class="brand-mark" aria-hidden="true">FS</span>
      <span class="brand-name">FairShare</span>
    </a>

    <nav class="nav-links" aria-label="Primary">
      <a
        href="/calculate"
        class="nav-link"
        class:nav-link--active={isCalc}
        aria-current={isCalc ? "page" : undefined}
      >
        <Calculator size={16} aria-hidden="true" />
        Calculate
      </a>
      <a
        href="/methodology"
        class="nav-link"
        class:nav-link--active={isMethodology}
        aria-current={isMethodology ? "page" : undefined}
      >
        <BookOpen size={16} aria-hidden="true" />
        Methodology
      </a>
      <a
        href="/saved"
        class="nav-link"
        class:nav-link--active={isSaved}
        aria-current={isSaved ? "page" : undefined}
      >
        Saved
      </a>
    </nav>

    <div class="nav-end">
      <ThemeToggle />
    </div>
  </div>
</header>

<style>
  .topnav {
    position: sticky;
    top: 0;
    z-index: 30;
    background: color-mix(in srgb, var(--color-bg) 80%, transparent);
    backdrop-filter: saturate(180%) blur(10px);
    border-bottom: 1px solid var(--color-border);
  }
  .topnav-inner {
    max-width: 1100px;
    margin: 0 auto;
    height: 60px;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1.5rem;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
  }
  .brand-mark {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.5rem;
    background: var(--color-accent);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }
  .brand-name {
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .nav-links {
    display: none;
    justify-content: center;
    gap: 0.25rem;
  }
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-pill);
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    text-decoration: none;
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .nav-link:hover {
    color: var(--color-text);
    background: var(--color-bg-elevated);
  }
  .nav-link--active {
    color: var(--color-text);
    font-weight: 500;
  }
  .nav-end {
    display: flex;
    justify-content: end;
  }

  @media (min-width: 640px) {
    .nav-links {
      display: inline-flex;
    }
  }
</style>
