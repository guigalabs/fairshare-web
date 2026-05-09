<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { Button, Field, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";

  let emailSubmitting = $state(false);
  let googleSubmitting = $state(false);

  function onEmailSubmit(e: SubmitEvent): void {
    if (emailSubmitting || googleSubmitting) {
      e.preventDefault();
      return;
    }
    emailSubmitting = true;
  }

  function onGoogleSubmit(e: SubmitEvent): void {
    if (emailSubmitting || googleSubmitting) {
      e.preventDefault();
      return;
    }
    googleSubmitting = true;
  }
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

  <form class="form" method="POST" action="?/default" onsubmit={onEmailSubmit}>
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

    <Button type="submit" fullWidth loading={emailSubmitting}>{t("login.submit")}</Button>
  </form>

  <div class="divider" role="separator" aria-orientation="horizontal">
    <span>{t("login.or")}</span>
  </div>

  <form class="form" method="POST" action="?/default" onsubmit={onGoogleSubmit}>
    <input type="hidden" name="providerId" value="google" />
    <input type="hidden" name="callbackUrl" value="/app" />
    <Button type="submit" variant="secondary" fullWidth loading={googleSubmitting}>
      {t("login.google")}
    </Button>
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
  .divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
    color: var(--color-text-muted);
    font-size: 0.8125rem;
  }
  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
  .legal {
    margin-top: 1.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
