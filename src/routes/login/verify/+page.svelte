<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { Button } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>Check your email · FairShare Pro</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  <ArticleHeader
    align="center"
    kicker={t("login.verify.kicker")}
    title={t("login.verify.title")}
    lede={t("login.verify.lede")}
  />

  <div class="cta">
    <Button href="/login" variant="ghost">{t("login.verify.back")}</Button>
  </div>
</section>

<style>
  .container {
    max-width: 480px;
    margin: 0 auto;
    padding: 4rem 1rem;
    text-align: center;
  }
  .cta {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
</style>
