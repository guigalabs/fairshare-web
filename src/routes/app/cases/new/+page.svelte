<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Gender, Madhhab } from "$engine";
  import { Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import HeirEditor, { type CaseHeirEntry } from "./HeirEditor.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let clientId = $state<string>("");
  let deceasedName = $state("");
  let dateOfDeath = $state("");
  let jurisdiction = $state("");
  let subjectGender = $state<Gender>("male");
  let madhhab = $state<Madhhab>("hanafi");
  let grossEstate = $state("");
  let currency = $state("USD");
  let heirs = $state<CaseHeirEntry[]>([{ type: "wife", count: 1, persons: [] }]);

  let submitting = $state(false);
  let error = $state<string | null>(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    error = null;
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId: clientId || null,
          deceasedName,
          dateOfDeath: dateOfDeath || null,
          jurisdiction: jurisdiction || null,
          subjectGender,
          madhhab,
          grossEstate: grossEstate || null,
          currency,
          heirs: heirs.map((h) => ({
            type: h.type,
            count: h.count,
            persons: h.persons?.filter((p) => p.name.trim()),
          })),
        }),
      });
      if (!res.ok) {
        error = `${t("app.cases.new.error")} (${res.status})`;
        submitting = false;
        return;
      }
      const body = (await res.json()) as { case: { id: string } };
      await goto(`/app/cases/${body.case.id}`);
    } catch (e) {
      error = t("app.cases.new.error");
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>{t("app.cases.new.title")} · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>{t("app.cases.new.title")}</h1>
</section>

<form onsubmit={submit} class="form">
  <Field label={t("app.cases.new.client")}>
    {#snippet children()}
      <select bind:value={clientId} class="control">
        <option value="">{t("app.cases.new.noClient")}</option>
        {#each data.clients as c (c.id)}
          <option value={c.id}>{c.displayName}</option>
        {/each}
      </select>
    {/snippet}
  </Field>

  <Field label={t("app.cases.new.deceasedName")}>
    {#snippet children()}
      <TextInput required bind:value={deceasedName} placeholder="Yousef Hassan" />
    {/snippet}
  </Field>

  <div class="grid">
    <Field label={t("app.cases.new.dateOfDeath")}>
      {#snippet children()}
        <TextInput type="date" bind:value={dateOfDeath} />
      {/snippet}
    </Field>
    <Field label={t("app.cases.new.jurisdiction")}>
      {#snippet children()}
        <TextInput bind:value={jurisdiction} placeholder="Lahore, Pakistan" />
      {/snippet}
    </Field>
  </div>

  <div class="grid">
    <Field label={t("app.cases.new.subjectGender")}>
      {#snippet children()}
        <select bind:value={subjectGender} class="control">
          <option value="male">{t("calculate.male")}</option>
          <option value="female">{t("calculate.female")}</option>
        </select>
      {/snippet}
    </Field>
    <Field label={t("app.cases.new.madhhab")}>
      {#snippet children()}
        <select bind:value={madhhab} class="control">
          <option value="general">{t("madhhab.general.name")}</option>
          <option value="hanafi">{t("madhhab.hanafi.name")}</option>
          <option value="maliki">{t("madhhab.maliki.name")}</option>
          <option value="shafii">{t("madhhab.shafii.name")}</option>
          <option value="hanbali">{t("madhhab.hanbali.name")}</option>
        </select>
      {/snippet}
    </Field>
  </div>

  <div class="grid">
    <Field label={t("app.cases.new.grossEstate")}>
      {#snippet children()}
        <TextInput bind:value={grossEstate} placeholder="487000.00" inputmode="decimal" />
      {/snippet}
    </Field>
    <Field label={t("app.cases.new.currency")}>
      {#snippet children()}
        <TextInput bind:value={currency} maxlength={3} placeholder="USD" />
      {/snippet}
    </Field>
  </div>

  <Field label={t("app.cases.new.heirs")}>
    {#snippet children()}
      <HeirEditor bind:value={heirs} />
    {/snippet}
  </Field>

  {#if error}
    <p class="error" role="alert">{error}</p>
  {/if}

  <div class="actions">
    <Button type="submit" loading={submitting}>{t("app.cases.new.submit")}</Button>
    <Button href="/app/cases" variant="ghost">{t("app.cases.new.cancel")}</Button>
  </div>
</form>

<style>
  .head {
    margin-bottom: 1.5rem;
  }
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 720px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  .control {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .error {
    color: var(--color-error);
    font-size: 0.875rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
</style>
