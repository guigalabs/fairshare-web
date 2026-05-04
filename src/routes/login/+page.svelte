<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>Sign in · FairShare Pro</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <ArticleHeader
    align="center"
    kicker={t("login.kicker")}
    title={t("login.title")}
    lede={t("login.lede")}
  />

  <form class="form" method="POST" action="?/default">
    <input type="hidden" name="providerId" value="resend" />
    <input type="hidden" name="callbackUrl" value="/app" />

    <Field label={t("login.emailLabel")}>
      {#snippet children()}
        <TextInput
          type="email"
          name="email"
          required
          autocomplete="email"
          placeholder="you@firm.com"
        />
      {/snippet}
    </Field>

    <Button type="submit" fullWidth>{t("login.submit")}</Button>

    <p class="legal">{t("login.legal")}</p>
  </form>
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
    margin-top: 0.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
