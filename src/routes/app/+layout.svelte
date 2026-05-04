<script lang="ts">
  import { Button } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import type { LayoutData } from "./$types";

  let { data, children }: { data: LayoutData; children: import("svelte").Snippet } = $props();
</script>

<header class="appbar">
  <div class="appbar-inner">
    <a href="/app/cases" class="brand">FairShare<span class="pro">Pro</span></a>
    <div class="actions">
      <span class="email">{data.session.user.email}</span>
      <form method="POST" action="/auth/signout">
        <Button type="submit" variant="ghost" size="sm">{t("app.signOut")}</Button>
      </form>
    </div>
  </div>
</header>

<main class="appmain">
  {@render children()}
</main>

<style>
  .appbar {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
  }
  .appbar-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .brand {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .pro {
    margin-inline-start: 0.25rem;
    color: var(--color-accent);
    font-weight: 500;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .email {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .appmain {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
</style>
