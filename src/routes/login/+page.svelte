<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { page } from "$app/state";
  import { Banner, Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";

  let emailSubmitting = $state(false);
  const locked = $derived(page.url.searchParams.get("error") === "locked");

  function onEmailSubmit(e: SubmitEvent): void {
    if (emailSubmitting) {
      e.preventDefault();
      return;
    }
    emailSubmitting = true;
  }
</script>

<svelte:head>
  <title>Sign in | FairShare Pro</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <ArticleHeader kicker={t("login.kicker")} title={t("login.title")} lede={t("login.lede")} />

  {#if locked}
    <Banner tone="warning">{t("login.locked")}</Banner>
  {/if}

  <form class="form" method="POST" onsubmit={onEmailSubmit}>
    <input type="hidden" name="providerId" value="resend" />
    <input type="hidden" name="callbackUrl" value="/app" />

    <Field label={t("login.emailLabel")}>
      {#snippet children()}
        <TextInput
          type="email"
          name="email"
          required
          autocomplete="email"
          placeholder="you@example.com"
        />
      {/snippet}
    </Field>

    <Button type="submit" fullWidth loading={emailSubmitting}>{t("login.submit")}</Button>
  </form>

  <p class="legal">{t("login.legal")}</p>
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
  .legal {
    margin-top: 1.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
