<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/ui";

  let confirmDelete = $state(false);
  let deleting = $state(false);
  let error = $state<string | null>(null);

  async function deleteAccount() {
    if (deleting) return;
    deleting = true;
    error = null;
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        error = `Failed to delete account (${res.status})`;
        deleting = false;
        return;
      }
      // Sign out and land on the home page.
      await goto("/auth/signout");
    } catch {
      error = "Could not reach the server.";
      deleting = false;
    }
  }
</script>

<svelte:head>
  <title>Data & account · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>Data & account</h1>
</section>

<div class="card">
  <h2>Export</h2>
  <p>
    Download every case, client, and branding setting attached to your account in a single JSON
    file.
  </p>
  <p class="actions">
    <Button href="/api/export" download>Download JSON</Button>
  </p>
</div>

<div class="card danger">
  <h2>Delete account</h2>
  <p>
    Permanently removes your account and every case, client, and setting. This action cannot be
    undone.
  </p>

  {#if !confirmDelete}
    <Button variant="destructive" onclick={() => (confirmDelete = true)}>Delete my account</Button>
  {:else}
    <p class="confirm">
      <strong>Are you sure?</strong> This deletes everything immediately.
    </p>
    <div class="actions">
      <Button variant="destructive" loading={deleting} onclick={deleteAccount}
        >Yes, delete everything</Button
      >
      <Button variant="ghost" onclick={() => (confirmDelete = false)}>Cancel</Button>
    </div>
  {/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}
</div>

<style>
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.25rem 1.5rem;
    background: var(--color-bg-elevated);
    margin-top: 1.5rem;
  }
  .card h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  .card p {
    color: var(--color-text-secondary);
    line-height: 1.55;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.75rem;
  }
  .danger {
    border-color: var(--color-error);
  }
  .danger h2 {
    color: var(--color-error);
  }
  .confirm {
    margin: 1rem 0;
    color: var(--color-text);
  }
  .error {
    color: var(--color-error);
    margin-top: 0.75rem;
  }
</style>
