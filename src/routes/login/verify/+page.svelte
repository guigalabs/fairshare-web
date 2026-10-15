<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { Banner, Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import { loc } from "$lib/i18n/url";

  let { data, form } = $props();
  let submitting = $state(false);

  const error = $derived(
    form?.error === "format"
      ? "login.verify.format"
      : data.error === "wrong"
        ? "login.verify.wrong"
        : null,
  );
</script>

<svelte:head>
  <title>Enter your code | FairShare Pro</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <ArticleHeader
    kicker={t("login.verify.kicker")}
    title={t("login.verify.title")}
    lede={data.email
      ? t("login.verify.lede", { email: data.email })
      : t("login.verify.ledeNoEmail")}
  />

  {#if error}
    <Banner tone="warning">{t(error)}</Banner>
  {/if}

  {#if data.email}
    <form
      class="form"
      method="POST"
      onsubmit={(e) => {
        if (submitting) e.preventDefault();
        submitting = true;
      }}
    >
      <Field label={t("login.verify.codeLabel")}>
        {#snippet children()}
          <TextInput
            name="code"
            required
            inputmode="numeric"
            autocomplete="one-time-code"
            pattern="[0-9 ]*"
            maxlength={7}
            placeholder="123456"
          />
        {/snippet}
      </Field>
      <Button type="submit" fullWidth loading={submitting}>{t("login.verify.submit")}</Button>
    </form>
  {/if}

  <div class="cta">
    <Button href={loc("/login")} variant="ghost">{t("login.verify.back")}</Button>
  </div>
</section>

<style>
  .container {
    max-width: 420px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  .cta {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
  }
</style>
