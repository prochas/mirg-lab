# CLAUDE.md

Context for AI assistants working in this repository. Read this fully before
making changes. Prefer the conventions here over generic defaults.

## Project

**mirga.lab** — an e-commerce shop selling handmade jewelry, primarily rings of
the owner's own design. This is an MVP. Keep it lean: do not add infrastructure,
abstractions, or features that aren't needed yet.

The shop UI is **bilingual: Lithuanian (default) and English** — see
"Internationalisation" below. Prices and currency are **EUR**. Customers are
mostly in the EU (Lithuania first).

## Tech stack

- **Next.js 16** (App Router, TypeScript, `src/` directory, import alias `@/*`)
- **Tailwind CSS**
- **next-intl** — LT/EN routing + message catalogs
- **Sanity** — product catalog + content (single source of truth for products).
  Studio is embedded in the app at `/studio`.
- **Stripe** — payments via **hosted Checkout** (not the custom Payment Element).
- **Resend** — order confirmation emails.

No database and no auth framework — see "Key architecture decisions" below.

## Key architecture decisions (do not undo without asking)

1. **No database.** Products live in Sanity. Orders live in Stripe (the Stripe
   Dashboard is the order admin). There is no Postgres/ORM in this project.
2. **No authentication. Guest checkout only.** Do not add Auth.js, Clerk, user
   accounts, sessions, or login UI. Stripe collects email/shipping at checkout.
3. **Stripe hosted Checkout.** The checkout route creates a Checkout Session and
   the client redirects to `session.url`. Do not build a custom card form.
4. **Cart is client-side** (planned: Zustand + localStorage). The cart stores
   only `{ id, size, qty }` — never prices.

## Internationalisation (next-intl)

Two locales: `lt` (default, **unprefixed**) and `en` (under `/en`).
`localePrefix: 'as-needed'`, so `/products/rings` is Lithuanian and
`/en/products/rings` is English; `/lt/...` 307-redirects to the unprefixed path.

`localeDetection: false` — deliberately. `/` is Lithuanian for every visitor
regardless of `Accept-Language`. With detection on (next-intl's default) an
English browser gets 307'd from `/` to `/en`, which both contradicts
"Lithuanian by default" and is what Google warns against: a crawler sending
`Accept-Language: en` would never see the Lithuanian home page. Don't re-enable
it; if the visitor's choice should be remembered, do it with an explicit
`NEXT_LOCALE` cookie set on click, not by sniffing headers.

Setup lives in:

- `i18n/routing.ts` — `defineRouting`, the `locales` tuple and the `Locale` type
- `i18n/navigation.ts` — locale-aware `Link`, `redirect`, `usePathname`,
  `useRouter`. **Always import `Link` from here for internal paths.** `next/link`
  drops the `/en` prefix and bounces English visitors back to Lithuanian.
  Hash-only hrefs (`#featured`) stay plain `<a>`.
- `i18n/request.ts` — loads `messages/<locale>.json` per request
- `i18n/metadata.ts` — `alternatesFor(href, locale)`: the `canonical` +
  `hreflang` block every page's `generateMetadata` must spread into `alternates`
- `proxy.ts` — the routing middleware (Next 16 renamed the convention from
  `middleware`). Its matcher excludes `/api` and `/studio` on purpose.
- `messages/lt.json`, `messages/en.json` — all UI copy, mirrored key-for-key

Rules:

- Every page under `app/[locale]/` must `await params` and call
  `setRequestLocale(locale)` — without it the page silently opts out of static
  rendering. Page metadata comes from `getTranslations({ locale, namespace })`.
- **Every page's `generateMetadata` must set `alternates: alternatesFor(href, locale)`**
  with its own locale-independent path. That emits `rel=canonical` plus
  `hreflang` for `lt`, `en` and `x-default` — the actual signal Google uses to
  pair the two language versions instead of treating them as duplicates. The
  absolute URLs come from `metadataBase` in `app/[locale]/layout.tsx`, which
  reads `NEXT_PUBLIC_BASE_URL`, so that variable must be the real production
  origin in prod or every canonical tag points at localhost.
- Server components use `getTranslations`; client components use
  `useTranslations`. Components rendered from both (`RingCard`) use the hook —
  it works in either.
- **UI chrome** (labels, buttons, headings, form copy) lives in
  `messages/*.json`. **Ordered content lists** (rings, about chapters/steps/
  values/stats) live in TypeScript keyed by locale (`Localized<T>`) with a
  `getX(locale)` accessor, because components iterate them and depend on their
  length. Don't move one to the other side without a reason.
- Product **slugs are shared across locales** — one canonical URL per product,
  and cart keys survive a language switch. Filtering matches on locale-stable
  keys (`materialKey`), never on the translated label.
- Prices go through `formatPrice(amount, locale)` in `lib/format.ts`:
  `145 €` in Lithuanian, `€145` in English. Never hardcode `{price} €`.
- Lithuanian plurals need all CLDR categories — `one`/`few`/`other` (see
  `catalog.found`). `few` covers 2–9, so "8" is *Rasti 8 žiedai*, not *žiedų*.
- The language switcher is `components/LanguageSwitcher.tsx`, sitting next to the
  cart button in the navbar. Flags are inline SVG, not emoji: Windows ships no
  flag glyphs, so 🇱🇹 would render as the letters "LT". It renders real
  `<a href>` — a button calling `router.replace()` leaves the other locale's URL
  nowhere in the HTML, so crawlers have nothing to follow. Hrefs come from
  `getPathname({ href, locale })`, **not** from `<Link locale={...}>`: passing an
  explicit `locale` to next-intl's `Link` always writes the prefix, even for the
  default locale, which would aim the Lithuanian link at `/lt` — a URL that only
  redirects to `/`.
- `/studio` sits outside `[locale]` and has its own root layout with
  `<html lang="en">`; `app/layout.tsx` is a pass-through that renders no
  `<html>` of its own.

When adding copy: add the key to **both** message files. A key present in only
one locale throws at render time in that locale.

## Core business logic: fulfillment, not stock

Every product is **always orderable** — there is no stock gating, no overselling
checks, no reservation system. A product just shows a different message depending
on whether a ready-made unit exists.

Each product has:
- `ready: boolean` — is there one finished unit on hand
- `readySize?: string` — the size of that finished unit (only when `ready`)
- `sizeOptions: string[]` — the sizes a customer can choose

The single source of truth for the customer-facing message is
`getFulfillment(product, chosenSize)` in `src/lib/fulfillment.ts`. It returns one
of three statuses:

- `ready_exact` — ready unit exists AND matches chosen size → "ready to ship"
- `ready_resize` — ready unit exists but different size → "resize takes 1–2 business days"
- `made_to_order` — no ready unit → "made to order, 1–2 weeks"

This same function/result is used in **three places**: the product page (after
size selection), the cart, and the checkout route (encoded into Stripe metadata
so the same info reaches the order + confirmation email). Do not duplicate this
logic — always call `getFulfillment`.

After a successful payment, the webhook flips `ready → false` for any units that
were `ready_exact` / `ready_resize` (the on-hand unit is now consumed). This is
**not load-bearing** for correctness (nothing can be "oversold" since everything
is made to order anyway) — it just keeps the displayed message accurate.

## Critical rules (these cause real bugs/security holes if ignored)

- **Prices come from Sanity on the server, never from the client.** The client
  sends only product id, size, qty. The checkout route fetches the price from
  Sanity and builds Stripe `price_data` from it. Never trust a client-supplied
  amount.
- **The Stripe webhook needs the raw request body.** In
  `app/api/webhook/route.ts` use `await req.text()` and read the signature with
  `(await headers()).get('stripe-signature')`. Never `req.json()` before
  verifying the signature.
- **API routes that touch Stripe must run on the Node runtime**, not edge:
  `export const runtime = 'nodejs'`.
- **Convert EUR to cents on the server**: `Math.round(price * 100)`. Sanity
  stores price in EUR (e.g. `120`), Stripe needs cents (`12000`).
- **Stripe metadata values are capped at 500 chars.** The cart summary is stored
  compactly as JSON in `session.metadata.items`. Keep it small; the checkout
  route rejects carts whose metadata would exceed the limit.

## Next.js 16 specifics

- `cookies()`, `headers()`, `params`, and `searchParams` are **async** — always
  `await` them.
- For Sanity content updates without redeploys, use tag-based revalidation
  (`revalidateTag`) triggered by a Sanity webhook hitting a revalidate route.
  (Not built yet — add when content edits need to go live instantly.)
- Be careful with the new caching model (`"use cache"` / cacheComponents); the
  checkout and webhook routes must not be statically cached.

## Project structure

Note: there is **no `src/` directory** — `app/`, `components/`, `lib/`, `i18n/`,
`messages/` and `sanity/` sit at the repo root. Entries marked *(planned)* do not
exist yet.

```
app/
  layout.tsx                   # pass-through only — renders no <html>
  globals.css
  [locale]/
    layout.tsx                 # root layout: <html lang>, fonts, providers
    page.tsx                   # home
    about/page.tsx
    contacts/page.tsx          # standalone page around <Contacts showEyebrow={false} />
    faq/page.tsx               # grouped accordions + FAQPage JSON-LD
    products/rings/page.tsx    # catalog
    products/[slug]/page.tsx   # product page (size selection + fulfillment msg)
    cart/page.tsx              # (planned — the drawer covers it for now)
    success/page.tsx           # (planned)
    cancel/page.tsx            # (planned — or reuse the cart as cancel target)
  api/                         # (planned — outside [locale], excluded in proxy.ts)
    checkout/route.ts          # POST: builds Stripe Checkout Session (price from Sanity)
    webhook/route.ts           # POST: verifies signature, flips ready->false, sends email
  studio/
    layout.tsx                 # own root layout, <html lang="en">
    [[...tool]]/page.tsx       # embedded Sanity Studio
i18n/
  routing.ts                   # locales, defaultLocale, localePrefix
  navigation.ts                # locale-aware Link / router
  request.ts                   # per-request message loading
messages/
  lt.json                      # all UI copy, mirrored key-for-key
  en.json
proxy.ts                       # next-intl routing middleware (Next 16 convention)
lib/
  rings.ts                     # mock catalog, Localized<T> + getRings(locale)
  about.ts                     # about-page content, same pattern
  faq.ts                       # grouped Q&A, same pattern — getFaqGroups(locale)
  nav.ts                       # nav link structure, shared by Navbar + MobileMenu
  cart.ts                      # mock cart lines + resolveCart(lines, locale, t)
  fulfillment.ts               # getFulfillment() — the shared business logic
  format.ts                    # formatPrice(amount, locale)
  scroll.ts                    # useScrollEffect for the scroll-driven sections
  stripe.ts                    # (planned) Stripe SDK singleton
  email.ts                     # (planned) Resend order confirmation
sanity/
  lib/client.ts                # read client + server-only write client + GROQ
  schemaTypes/
store/                         # (planned) cart (Zustand)
components/
```

## Sanity product schema (summary)

`product` document: `title`, `slug`, `images[]`, `price` (number, EUR),
`description` (portable text), `materials[]`, `sizeOptions[]` (required),
`ready` (boolean), `readySize` (string, hidden unless `ready`).

GROQ for checkout fetches by ids and returns `_id, title, price, ready,
readySize, slug` — see `productsByIdsQuery` in `src/sanity/client.ts`.

## Data flow (end to end)

1. Product page: customer must pick a size before "add to cart"; the page shows
   `getFulfillment(product, size, t).message`, where `t` is the translator for the
   `fulfillment` namespace. Anything that only needs to branch on the state (the
   webhook, Stripe metadata) uses `getFulfillmentStatus(product, size)` instead,
   which needs no translator.
2. Cart key is `productId + size` (same ring in two sizes = two line items).
3. Checkout: client POSTs `{ items: [{ id, size, qty }] }` to `/api/checkout`.
4. Server fetches products from Sanity, builds Stripe line items with prices from
   Sanity and `getFulfillment` message in each item's description, stores a
   compact summary in `session.metadata`, returns `session.url`.
5. Client redirects to `session.url` (Stripe hosted).
6. On `checkout.session.completed`, `/api/webhook` flips consumed units to
   `ready=false` and sends the confirmation email via Resend.

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=          # Editor permissions, server-only (used by webhook)
STRIPE_SECRET_KEY=           # sk_test_... in dev
STRIPE_WEBHOOK_SECRET=       # from `stripe listen` locally / Dashboard in prod
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Never expose `SANITY_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, or `STRIPE_WEBHOOK_SECRET`
to the client. Only `NEXT_PUBLIC_*` vars may reach the browser.

## Commands

```bash
npm run dev        # Next dev server (http://localhost:3000)
npm run build      # production build
npm run lint       # ESLint

# Local Stripe webhook forwarding (run in a separate terminal during dev):
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed   # send a test event
```

## Known MVP trade-offs (intentional — don't "fix" without discussion)

- **No idempotency on the confirmation email.** If Stripe redelivers the event,
  the customer could get two emails. Acceptable at MVP volume. Future fix: store
  processed `session.id`s (e.g. in Sanity) and check before sending.
- **No race-condition handling.** Not needed — everything is made-to-order, so
  nothing can be oversold.
- **Orders are not written back to Sanity.** The Stripe Dashboard is the order
  source of truth. Add an `order` document type only if Studio-side order viewing
  is wanted.

## Conventions

- TypeScript throughout; avoid `any`.
- Keep server-only code (Stripe, write tokens) out of client components.
- No hardcoded UI copy — every user-visible string goes through next-intl, in
  both `messages/lt.json` and `messages/en.json`. Code/comments stay English.
- Prefer Server Components + GROQ for data fetching; client components only for
  interactivity (cart, size selection, language switch).

## TODO / not yet built

- [ ] Product page with required size selector + fulfillment message
- [ ] Zustand cart (+ localStorage persistence)
- [ ] Catalog + home pages
- [ ] success / cancel pages
- [ ] Resend domain verification (sender: uzsakymai@mirga.lab)
- [ ] Sanity → revalidateTag webhook for instant content updates
- [ ] Legal pages (terms, privacy, returns — note the made-to-order/custom-goods
      exception to the EU 14-day withdrawal right; verify with VVTAT guidance).
      The FAQ already states this policy in plain language (`lib/faq.ts`,
      `returns` group) — keep the two in step, and treat the legal page as the
      authoritative wording.
- [ ] Cookie consent + analytics
- [ ] Stripe Tax (EU VAT) before launch
- [ ] Localise Sanity product content once the catalog moves off `lib/rings.ts`
      (internationalised array fields, or `title_lt` / `title_en`), and translate
      the Stripe line-item descriptions + Resend email per locale
- [ ] Set `NEXT_PUBLIC_BASE_URL=https://mirgalab.com` in the production
      environment — `canonical` / `hreflang` tags are built from it
- [ ] `sitemap.ts` listing both locales per route (hreflang is in place; a
      sitemap is the other half of getting `/en` discovered)
- [ ] Optionally remember the visitor's locale choice via an explicit
      `NEXT_LOCALE` cookie set on switch — never by `Accept-Language` sniffing,
      see "Internationalisation"

## Project facts to confirm / fill in

- Node version:  v22.
- Package manager: ___ (npm / pnpm / yarn)
- Deploy target: Vercel
- Production domain: https://mirgalab.com
- Shipping countries: LT and other EU countries
