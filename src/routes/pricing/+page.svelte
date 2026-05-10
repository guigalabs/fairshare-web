<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import { Button, Card, Field, TextInput } from "$lib/ui";
  import Check from "@lucide/svelte/icons/check";
  import { t } from "$lib/i18n/index.svelte";

  type Cadence = "monthly" | "annual";
  const CADENCES = [
    { value: "monthly", labelKey: "pricing.cadence.monthly" },
    { value: "annual", labelKey: "pricing.cadence.annual" },
  ] as const satisfies ReadonlyArray<{ value: Cadence; labelKey: string }>;

  let cadence: Cadence = $state("monthly");
  let email = $state("");
  let status: "idle" | "pending" | "ok" | "error" = $state("idle");
  let subscribing = $state(false);

  function onSubscribe(e: SubmitEvent): void {
    // Block re-submits if Stripe is already being contacted; let the first
    // submission proceed normally so the browser handles the 303 redirect.
    if (subscribing) {
      e.preventDefault();
      return;
    }
    subscribing = true;
  }

  async function submitWaitlist(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (status === "pending") return;
    status = "pending";
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      status = res.ok ? "ok" : "error";
    } catch {
      status = "error";
    }
  }

  const FEATURES = [
    "pricing.feature.cases",
    "pricing.feature.namedHeirs",
    "pricing.feature.estate",
    "pricing.feature.brandedPdf",
    "pricing.feature.compare",
    "pricing.feature.export",
  ] as const;
</script>

<svelte:head>
  <title>Pricing · FairShare Pro</title>
  <meta
    name="description"
    content="FairShare Pro for Islamic estate practitioners. Case folders, named heirs, estate amounts, branded PDFs, side-by-side madhab compare. $19/mo or $179/yr."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/pricing/" />
  <meta property="og:title" content="FairShare Pro for Practitioners" />
  <meta
    property="og:description"
    content="A workspace for Islamic estate attorneys, wasiyyah drafters, and scholars. Case folders, branded PDFs, side-by-side madhab compare. $19/mo or $179/yr."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fairshare.guigalabs.com/pricing/" />
</svelte:head>

<section class="container">
  <ArticleHeader
    align="center"
    kicker={t("pricing.kicker")}
    title={t("pricing.title")}
    lede={t("pricing.lede")}
  />

  <Card>
    {#snippet children()}
      <div class="plan">
        <div class="cadence" role="group" aria-label={t("pricing.cadence.label")}>
          {#each CADENCES as opt (opt.value)}
            <button
              type="button"
              class="cadence-btn"
              class:active={cadence === opt.value}
              aria-pressed={cadence === opt.value}
              onclick={() => (cadence = opt.value)}
            >
              {t(opt.labelKey)}
            </button>
          {/each}
        </div>

        <div class="price">
          {#if cadence === "monthly"}
            <span class="price-amount">$19</span>
            <span class="price-unit">{t("pricing.perMonth")}</span>
          {:else}
            <span class="price-amount">$179</span>
            <span class="price-unit">{t("pricing.perYear")}</span>
            <span class="price-savings">{t("pricing.annualSavings")}</span>
          {/if}
        </div>

        <ul class="features">
          {#each FEATURES as key (key)}
            <li>
              <Check size={16} aria-hidden="true" />
              <span>{t(key)}</span>
            </li>
          {/each}
        </ul>

        <form method="POST" action="/api/stripe/checkout" class="subscribe" onsubmit={onSubscribe}>
          <input type="hidden" name="cadence" value={cadence} />
          <Button type="submit" fullWidth loading={subscribing}>
            {t("pricing.subscribe")}
          </Button>
        </form>
        <p class="comingSoon">{t("pricing.checkoutNote")}</p>
      </div>
    {/snippet}
  </Card>

  <section class="waitlist">
    <h2>{t("pricing.waitlist.title")}</h2>
    <p class="waitlist-sub">{t("pricing.waitlist.sub")}</p>

    {#if status === "ok"}
      <p class="waitlist-thanks" role="status">{t("pricing.waitlist.thanks")}</p>
    {:else}
      <form class="waitlist-form" onsubmit={submitWaitlist}>
        <Field
          label={t("pricing.waitlist.emailLabel")}
          error={status === "error" ? t("pricing.waitlist.error") : undefined}
        >
          {#snippet children()}
            <TextInput
              type="email"
              required
              autocomplete="email"
              bind:value={email}
              placeholder="you@firm.com"
            />
          {/snippet}
        </Field>
        <Button type="submit" loading={status === "pending"}>{t("pricing.waitlist.submit")}</Button>
      </form>
    {/if}
  </section>

  <div class="cta">
    <Button href="/calculate" variant="secondary">{t("pricing.tryFree")}</Button>
    <Button href="/methodology" variant="secondary">{t("pricing.readMethodology")}</Button>
  </div>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }

  .plan {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 1rem;
  }

  .cadence {
    display: inline-flex;
    padding: 0.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: var(--color-bg-elevated);
  }
  .cadence-btn {
    padding: 0.5625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .cadence-btn.active {
    background: var(--color-bg);
    color: var(--color-text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 0.5rem;
  }
  .price-amount {
    font-size: clamp(2.25rem, 6vw, 3.25rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .price-unit {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }
  .price-savings {
    width: 100%;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-accent);
    font-weight: 500;
  }

  .features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;
    max-width: 32rem;
  }
  @media (min-width: 600px) {
    .features {
      grid-template-columns: 1fr 1fr;
    }
  }
  .features li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.9375rem;
    color: var(--color-text);
  }
  .features li :global(svg) {
    margin-top: 0.2rem;
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .subscribe {
    width: 100%;
    max-width: 18rem;
    margin: 0.5rem 0 0.25rem;
  }
  .comingSoon {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .waitlist {
    margin-top: 2.5rem;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-elevated);
  }
  .waitlist h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .waitlist-sub {
    margin-top: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .waitlist-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  @media (min-width: 600px) {
    .waitlist-form {
      flex-direction: row;
      align-items: flex-end;
    }
    .waitlist-form :global(.field) {
      flex: 1;
    }
  }
  .waitlist-thanks {
    margin-top: 1rem;
    color: var(--color-text);
    font-size: 0.9375rem;
  }

  .cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }
</style>
