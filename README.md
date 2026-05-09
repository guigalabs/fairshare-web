# fairshare-web

Web port of [FairShare iOS](https://github.com/guigalabs/fairshare-ios) — an Islamic
inheritance (Fara'id) calculator. Five madhabs, full Quranic citations, bilingual EN/AR
with full RTL, family-tree visualization, PDF export. Free, offline-first, no accounts.

Deployed at **https://fairshare.guigalabs.com**.

## Stack

- **SvelteKit 2 + Svelte 5** (runes)
- **Vite 8 + TypeScript strict + Tailwind v4** (`@tailwindcss/vite`)
- **`@sveltejs/adapter-cloudflare`** → Cloudflare Pages (free routes prerendered, `/api/**` and future `/app/**` run as Pages Functions)
- **Bun** (dev runtime + package manager)
- **Engine**: TypeScript port of `FairShareEngine` Swift package, with BigInt-backed exact
  fractions and a snapshot parity test against the Swift side.
- **Persistence**: Dexie (IndexedDB).
- **i18n**: Paraglide JS for EN/AR with locale-segmented routes.
- **PDF export**: `pdf-lib` + `@pdf-lib/fontkit` (embedded Noto Naskh Arabic).
- **PWA**: `@vite-pwa/sveltekit` — installable, offline-capable calculator.
- **Tests**: Vitest (unit), Playwright (e2e + axe-core a11y).
- **Format**: Prettier + svelte/tailwind plugins.

## Develop

```bash
bun install
bun run dev              # http://localhost:5173
bun run check            # type-check via svelte-check
bun run test             # vitest unit tests
bun run test:e2e         # playwright e2e (boots its own preview server)
bun run test:a11y        # axe-core via playwright
bun run build            # output to .svelte-kit/cloudflare
bun run preview          # serve the build locally (prerendered routes only)
bun run fmt              # prettier --write .
```

## Deploy

```bash
bunx wrangler pages deploy .svelte-kit/cloudflare --project-name=fairshare-web
```

`/api/**` and (future) `/app/**` routes run as Cloudflare Pages Functions. KV
bindings are declared in `wrangler.toml`; create namespaces with:

```bash
bunx wrangler kv namespace create WAITLIST_KV
bunx wrangler kv namespace create WAITLIST_KV --preview
```

Paste the returned IDs into `wrangler.toml`.

## Database (Neon Postgres)

User accounts, cases, and Pro subscriptions live in Neon. Drizzle ORM owns
the schema; the Auth.js Drizzle adapter wires session / verification
tokens.

```bash
# local dev / migrations
export DATABASE_URL="postgres://...neon..."
bun run db:generate          # diff schema.ts → drizzle/*.sql
bun run db:migrate           # apply migrations
bun run db:studio            # browse rows
```

Bind `DATABASE_URL` as a Pages secret for the deployed environments
(`bunx wrangler pages secret put DATABASE_URL`).

## Billing (Stripe Managed Payments)

FairShare Pro is sold via **Stripe Managed Payments**, so Stripe acts as
the merchant of record. Tax (VAT/sales tax/GST), fraud screening, dispute
management, and transactional support are all absorbed by Stripe — no
separate Tax/Radar subscription required.

The integration lives in `src/lib/server/stripe.ts` (webhook signature
verifier, `applySubscriptionEvent`, and a `stripeRequest` helper that
pins every call to API version `2025-03-31.basil`). Three endpoints:

- `POST /api/stripe/checkout` — creates a Managed Payments Checkout
  session and 303-redirects to it. Carries `subscription_data.metadata.user_id`
  so the lifecycle webhook can bind the subscription to our user row.
- `POST /api/stripe/portal` — creates a customer-portal session and
  redirects to it.
- `POST /api/stripe/webhook` — verifies `Stripe-Signature` and upserts
  on `customer.subscription.{created,updated,deleted,paused,resumed}`.

### One-time setup

1. **Activate Managed Payments** in the Dashboard:
   <https://dashboard.stripe.com/settings/managed-payments>
2. Create the Pro product with two recurring prices (monthly $19, annual
   $179). Each must use a Managed-Payments-eligible tax code.
3. Add the production webhook endpoint pointing at
   `https://fairshare.guigalabs.com/api/stripe/webhook`. Subscribe to
   `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `customer.subscription.paused`,
   `customer.subscription.resumed`.
4. Bind the secrets to Cloudflare Pages:

   ```bash
   bunx wrangler pages secret put STRIPE_SECRET_KEY
   bunx wrangler pages secret put STRIPE_WEBHOOK_SECRET
   bunx wrangler pages secret put STRIPE_PUBLISHABLE_KEY
   bunx wrangler pages secret put STRIPE_PRICE_ID_MONTHLY
   bunx wrangler pages secret put STRIPE_PRICE_ID_ANNUAL
   ```

### Local webhook dev loop

```bash
# Terminal 1 — start the dev server
bun run dev

# Terminal 2 — forward live test-mode events to your local handler.
# The first line of output is the listen-secret to use as STRIPE_WEBHOOK_SECRET.
stripe listen --forward-to localhost:5173/api/stripe/webhook \
  --events customer.subscription.created,customer.subscription.updated,customer.subscription.deleted

# Terminal 3 — fire a test event
stripe trigger customer.subscription.created
```

### Manual Pro grants (pre-Stripe)

Until Stripe is wired up in production, you can hand-grant Pro to a
user (after they've signed in once so a `user` row exists):

```bash
export DATABASE_URL="postgres://...neon..."
bun run pro:grant amina@firm.com           # monthly cadence
bun run pro:grant amina@firm.com --annual  # annual cadence
bun run pro:list                           # show everyone with Pro
bun run pro:revoke amina@firm.com
```

The script writes a synthetic `subscription` row with
`stripe_subscription_id = manual_<user_id>` so it's easy to spot and
clean up once real Stripe webhooks start flowing.

## See also

- Plan: `~/.claude/plans/twinkly-plotting-torvalds.md`
- iOS source: `~/src/guigalabs/fairshare-ios`
- Engine source-of-truth: `~/src/guigalabs/fairshare-ios/FairShareEngine/`
