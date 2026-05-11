<script lang="ts">
  import { Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let letterheadText = $state(data.branding?.letterheadText ?? "");
  let customDisclaimerEn = $state(data.branding?.customDisclaimerEn ?? "");
  let customDisclaimerAr = $state(data.branding?.customDisclaimerAr ?? "");
  let primaryColor = $state(data.branding?.primaryColor ?? "#0f172a");
  let signatureBlock = $state(data.branding?.signatureBlock ?? "");

  let saving = $state(false);
  let savedAt = $state<Date | null>(null);
  let error = $state<string | null>(null);

  async function save(e: SubmitEvent) {
    e.preventDefault();
    if (saving) return;
    saving = true;
    error = null;
    try {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          letterheadText: letterheadText || null,
          customDisclaimerEn: customDisclaimerEn || null,
          customDisclaimerAr: customDisclaimerAr || null,
          primaryColor: primaryColor || null,
          signatureBlock: signatureBlock || null,
        }),
      });
      if (!res.ok) {
        error = t("app.branding.error", { status: res.status });
        return;
      }
      savedAt = new Date();
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>{t("app.branding.title")} · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>{t("app.branding.title")}</h1>
  <p class="lede">{t("app.branding.lede")}</p>
</section>

<form onsubmit={save} class="form">
  <Field label={t("app.branding.letterhead.label")} description={t("app.branding.letterhead.desc")}>
    {#snippet children()}
      <TextInput bind:value={letterheadText} placeholder="Hassan & Partners, LLP" maxlength={200} />
    {/snippet}
  </Field>

  <Field label={t("app.branding.color.label")} description={t("app.branding.color.desc")}>
    {#snippet children()}
      <input type="color" bind:value={primaryColor} class="color" />
    {/snippet}
  </Field>

  <Field label={t("app.branding.disclaimerEn.label")}>
    {#snippet children()}
      <textarea rows="3" class="textarea" bind:value={customDisclaimerEn} maxlength={2000}
      ></textarea>
    {/snippet}
  </Field>

  <Field label={t("app.branding.disclaimerAr.label")}>
    {#snippet children()}
      <textarea rows="3" class="textarea" dir="rtl" bind:value={customDisclaimerAr} maxlength={2000}
      ></textarea>
    {/snippet}
  </Field>

  <Field label={t("app.branding.signature.label")} description={t("app.branding.signature.desc")}>
    {#snippet children()}
      <textarea
        rows="4"
        class="textarea"
        bind:value={signatureBlock}
        placeholder={`Mufti A. Hassan\nDated: …\nFor: Hassan & Partners`}
        maxlength={1000}
      ></textarea>
    {/snippet}
  </Field>

  {#if error}<p class="error" role="alert">{error}</p>{/if}
  {#if savedAt}
    <p class="ok" role="status">
      {t("app.branding.saved", { time: savedAt.toLocaleTimeString() })}
    </p>
  {/if}

  <div class="actions">
    <Button type="submit" loading={saving}>{t("app.branding.submit")}</Button>
  </div>
</form>

<style>
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .lede {
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 640px;
    margin-top: 1.5rem;
  }
  .textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
    font-family: inherit;
    line-height: 1.5;
    resize: vertical;
  }
  .color {
    width: 4rem;
    height: 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    cursor: pointer;
  }
  .error {
    color: var(--color-error);
  }
  .ok {
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
  }
</style>
