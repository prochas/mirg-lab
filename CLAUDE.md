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

- **Next.js 16** (App Router, TypeScript, no `src/` directory, import alias `@/*`)
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
4. **Cart is client-side**: Zustand + localStorage in `store/cart.ts`. It stores
   only `{ id, size, qty }` — never prices, never titles. `id` is the Sanity
   document id, which is also what the checkout read looks up.

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
  `messages/*.json`. **Product content** (ring titles, descriptions, spec
  bullets, material names) lives in **Sanity**, stored as `{ lt, en }` objects
  per field. **Remaining ordered content lists** (about chapters/steps/values/
  stats, FAQ groups) still live in TypeScript keyed by locale (`Localized<T>`)
  with a `getX(locale)` accessor, because components iterate them and depend on
  their length. Don't move one to the other side without a reason.
- In Sanity, **only the default locale (`lt`) is required** on a translatable
  field. `localize()` in `lib/rings.ts` falls back to `lt` when an `en`
  translation is missing, so a half-translated ring renders Lithuanian rather
  than an empty heading. Never let a missing translation throw.
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
`getFulfillment(product, chosenSize)` in `lib/fulfillment.ts`. It returns one
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
  amount. The route reads *only* those three fields off each line, so a request
  carrying `price`, `unit_amount` or `currency` has no effect — don't ever start
  reading an amount, a discount or a total off the request. Same rule for the
  free-shipping decision: it is computed from the Sanity subtotal, never from a
  total the client claims.
- **Read prices with `sanityFetchFresh`, not `sanityFetch`.** The latter caches
  for 60s and hits the CDN, which would let an order be priced at a superseded
  amount for up to a minute after an edit.
- **Redirect URLs are built from `NEXT_PUBLIC_BASE_URL`, never from request
  headers.** Deriving `success_url` from `Host`/`Origin` turns the route into an
  open redirect.
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
- **Never put a `.` in a Sanity document `_id`.** Sanity treats any id containing
  a period as *private*: it is readable with a token but returns **nothing** to
  an unauthenticated request — which is exactly what the shop's read client
  makes. Use dashes (`product-bangele`, `material-silver-925`). This failed
  silently once already: the seed reported success, Studio and every
  token-authenticated query showed all 8 rings, and the shop rendered an empty
  catalog. If content exists in Studio but the site can't see it, check the ids
  first. Verify with a tokenless query, not a token'd one.

## Next.js 16 specifics

- `cookies()`, `headers()`, `params`, and `searchParams` are **async** — always
  `await` them.
- Every product read goes through `sanityFetch()` in `sanity/lib/client.ts`,
  which caches for 60s and tags the result with `PRODUCTS_TAG`. The revalidate
  *route* isn't built yet, but the tag is already in place — a Sanity webhook
  calling `revalidateTag(PRODUCTS_TAG)` is all that's left to make edits instant.
  Don't call `client.fetch` directly for product data; that bypasses both.
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
    success/page.tsx           # retrieves the session from Stripe, clears cart if paid
    cancel/page.tsx            # nothing charged, cart intact, reopens the drawer
  api/                         # outside [locale], excluded in proxy.ts
    checkout/route.ts          # POST: builds Stripe Checkout Session (price from Sanity)
    webhook/route.ts           # (planned) verify signature, flip ready->false, send email
    revalidate/route.ts        # POST: Sanity webhook -> revalidateTag(PRODUCTS_TAG)
  actions/
    cart.ts                    # 'use server' — resolveCartAction(lines, locale)
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
store/
  cart.ts                      # Zustand cart, persisted to localStorage
lib/
  shipping.ts                  # EU country list + zone rates (in cents)
  stripe.ts                    # lazy server-only Stripe singleton
  rings.ts                     # Sanity-backed catalog — async getRings(locale) etc.
  about.ts                     # about-page content, Localized<T> in TypeScript
  faq.ts                       # grouped Q&A, same pattern — getFaqGroups(locale)
  nav.ts                       # nav link structure, shared by Navbar + MobileMenu
  cart.ts                      # CartLine/CartItem types, cartKey(), async resolveCart()
  fulfillment.ts               # getFulfillment() — the shared business logic
  format.ts                    # formatPrice(amount, locale)
  scroll.ts                    # useScrollEffect for the scroll-driven sections
  email.ts                     # (planned) Resend order confirmation
sanity/
  env.ts                       # projectId / dataset / apiVersion (throws if unset)
  lib/client.ts                # read client, getWriteClient(), sanityFetch(), PRODUCTS_TAG
  lib/queries.ts               # all GROQ — shared PRODUCT_FIELDS projection
  lib/image.ts                 # urlFor() image URL builder
  structure.ts                 # Studio desk: Rings + Materials
  schemaTypes/
    localeTypes.ts             # localeString / localeText / localeStringList
    materialType.ts            # material doc: key (slug) + localized title
    productType.ts             # the ring document
scripts/
  seed-rings.mjs               # one-off migration of the original 8 mock rings
components/
```

## Sanity product schema

Translatable fields use the reusable `localeString` / `localeText` /
`localeStringList` object types — `{ lt, en }` on the document itself, `lt`
required, `en` optional.

`product` document (`sanity/schemaTypes/productType.ts`):

| Field         | Type               | Notes                                            |
| ------------- | ------------------ | ------------------------------------------------ |
| `title`       | `localeString`     | required                                         |
| `slug`        | `slug`             | **shared across locales** — one canonical URL    |
| `material`    | `reference`        | → `material` doc, required                       |
| `description` | `localeText`       | the paragraph under the price                    |
| `details`     | `localeStringList` | spec bullets in the accordion                    |
| `price`       | `number`           | whole EUR, required, positive                    |
| `sizeOptions` | `string[]`         | required, min 1, unique                          |
| `ready`       | `boolean`          | is a finished unit on hand                       |
| `readySize`   | `string`           | hidden unless `ready`; validated ∈ `sizeOptions` |
| `images`      | `image[]`          | **positional** — see below                       |
| `featured`    | `boolean`          | home page shows the first four                   |
| `order`       | `number`           | catalog default sort, ties break on `title.lt`   |

`material` document: `title` (`localeString`) + `key` (`slug`). **`key` is the
locale-stable filter id** — the catalog filters on `materialKey` and only ever
*displays* the translated `title`. Never match on the label.

**`images` order is a contract**: `[0]` is the card photo, `[1]` is the hover
swap, the rest are gallery-only. Reordering the array in Studio changes the card.

All GROQ lives in `sanity/lib/queries.ts` and shares one `PRODUCT_FIELDS`
projection. Queries return translatable fields as whole `{ lt, en }` objects and
images as bare asset refs; `localize()` in `lib/rings.ts` resolves the locale and
builds CDN URLs via `urlFor()`. Doing the locale pick in GROQ would mean a
`select()` per field in every query. `productsByIdsQuery` is the checkout read
(`_id, price, ready, readySize, slug, title`).

Queries exclude drafts explicitly (`!(_id in path("drafts.**"))`) — the read
client has no token, so on a public dataset unpublished rings would otherwise
appear in the shop.

## Data flow (end to end)

1. Product page: customer must pick a size before "add to cart"; the page shows
   `getFulfillment(product, size, t).message`, where `t` is the translator for the
   `fulfillment` namespace. Anything that only needs to branch on the state (the
   webhook, Stripe metadata) uses `getFulfillmentStatus(product, size)` instead,
   which needs no translator.
2. Cart key is `productId + size` — `cartKey()` in `lib/cart.ts`, so the same
   ring in two sizes is two line items. Add-to-cart writes only
   `{ id, size, qty }` into the Zustand store.
2b. The drawer is a client component and the catalog is in Sanity, so it cannot
   read products during render. It calls `resolveCartAction(lines, locale)` (a
   server action) whenever the lines change — eagerly, not on open, so the
   drawer is already populated. Two rules that matter there:
   - **Quantity and line total render from the store, not from the resolved
     items.** The resolve is a round-trip; reading qty from it makes the +/−
     steppers visibly lag. Product name/photo/unit price come from the server,
     quantities from the store — see `rows` in `CartDrawer`.
   - Anything the resolve doesn't return (deleted or unpublished in Studio) is
     pruned from the store via `keepOnly`, so the badge can't disagree with the
     visible lines.
   The action is a public POST endpoint: it shape-checks its input, caps lines
   at 50 and qty at `MAX_QTY`, and only ever reads public catalog data.
2c. Anything reading the cart during SSR must gate on `useCartHydrated()` —
   the server renders an empty cart and the browser rehydrates a full one, so
   reading `lines` directly on the first client render is a hydration mismatch.
3. Checkout: client POSTs `{ items: [{ id, size, qty }], locale }` to
   `/api/checkout`. That is the entire payload — there is no amount in it.
4. The route (`app/api/checkout/route.ts`) then, in this order:
   - shape-checks every line and rejects the whole cart on anything unexpected
     (bad types, `qty < 1`, >50 lines, duplicate `id+size`);
   - re-reads the products from Sanity via **`sanityFetchFresh`** — uncached and
     off-CDN, so a just-changed price can't be sold at the old amount;
   - refuses unknown/unpublished ids (`unknown_product`) rather than skipping
     them, a non-positive price (`unavailable`), and a size not in
     `sizeOptions` (`invalid_size`);
   - builds `price_data` with `unit_amount: Math.round(price * 100)` and
     `currency: 'eur'`, both from Sanity;
   - picks shipping from the **Sanity-derived** subtotal (see below);
   - writes a compact `session.metadata.items` summary, rejecting the cart if it
     would exceed Stripe's 500-char cap;
   - returns only `{ url }`.
   Validation runs entirely before Stripe is called, so a bad cart never creates
   a session. Errors come back as short codes; details stay in the server log.
5. Client redirects to `session.url` (Stripe hosted) via `window.location`.
   The cart is **not** cleared here — `/success` clears it only after Stripe
   confirms `payment_status === 'paid'`, so cancelling keeps the cart.
6. On `checkout.session.completed`, `/api/webhook` flips consumed units to
   `ready=false` and sends the confirmation email via Resend.

## Shipping

Rates live in `lib/shipping.ts` as constants in **euro cents**, alongside the
allowed-country list (all 27 EU states).

Above `FREE_SHIPPING_FROM` (€100, from `lib/cart.ts`) the session gets a single
free option, so there is nothing to choose. Below it, both zone rates are
offered — Lithuania €3.90, rest of the EU €9.90.

The zone is the **customer's selection**, not something the server derives:
Stripe fixes `shipping_options` when the session is created, so they cannot
react to the address typed in afterwards. The Dashboard shows the delivery
address next to the rate they picked, so a mismatch is visible. Upgrading means
either collecting the country before creating the session or moving to Stripe's
dynamic shipping — don't "fix" it by trusting a client-sent country, which is
exactly how you get €3.90 shipping to Portugal.

## Taxes (Stripe Tax / EU VAT)

`app/api/checkout/route.ts` passes `automatic_tax: { enabled: TAX_ENABLED }`,
where `TAX_ENABLED` reads `STRIPE_TAX_ENABLED === "true"` — **off by default**,
and deliberately not auto-enabled. Stripe hard-fails every Checkout Session
creation if `automatic_tax.enabled` is `true` and the account has no origin
address / tax registration configured under Dashboard → Tax → Settings; there
is no graceful degradation, so flipping this on is a two-step process:

1. In the Stripe Dashboard: set the origin address, decide the VAT posture
   (see below), and add at least one tax registration.
2. Set `STRIPE_TAX_ENABLED=true` in the environment.

Every ring's `price_data` already carries `tax_behavior: "inclusive"` and
`tax_code: "txcd_99999999"` (general tangible goods — no EU country taxes
jewelry differently from other physical goods), and `lib/shipping.ts`'s
`shipping_rate_data` carries the same `tax_behavior`. These are harmless to
send whether or not tax is enabled, so they aren't gated behind the flag —
only `automatic_tax.enabled` is. **Inclusive** means the EUR price already
shown in the shop is the final charge; Stripe backs the VAT amount for the
buyer's EU country out of that total rather than adding it on top, so the
price never changes depending on where the customer is.

**VAT registration is a business decision, not a code one** — this
repository does not assume the seller is VAT-registered. Below the EU-wide
€10,000/year distance-selling threshold, a Lithuania-based seller charges
Lithuanian VAT (or none, if under the separate ~€45,000 Lithuanian VAT-payer
registration threshold and not registered at all); above €10,000, VAT is due
at the buyer's country rate, normally remitted through the EU One-Stop-Shop
(OSS) scheme. Don't enable `STRIPE_TAX_ENABLED` until that registration
status is real and reflected in the Dashboard.

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=          # Editor permissions, server-only (used by webhook)
STRIPE_SECRET_KEY=           # sk_test_... in dev
STRIPE_WEBHOOK_SECRET=       # from `stripe listen` locally / Dashboard in prod
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SANITY_REVALIDATE_SECRET=    # shared secret for the Studio -> /api/revalidate webhook
STRIPE_TAX_ENABLED=          # "true" to turn on Stripe Tax — see "Taxes" above;
                              # requires Dashboard setup first, do not set blindly
```

Never expose `SANITY_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or
`SANITY_REVALIDATE_SECRET` to the client. Only `NEXT_PUBLIC_*` vars may reach the
browser.

## Commands

```bash
npm run dev        # Next dev server (http://localhost:3000)
npm run build      # production build
npm run lint       # ESLint

# One-off: migrate the original 8 mock rings into Sanity (needs SANITY_WRITE_TOKEN).
# Idempotent — deterministic doc ids, images deduped by filename label.
npm run seed:rings
npm run seed:rings -- --replace   # overwrite the seeded docs, discarding Studio edits

# Stop the dev server BEFORE deleting .next. Turbopack keeps a persistent task
# database open at .next/dev/cache/turbopack; removing it under a live process
# corrupts that database and the server then panics with "Failed to restore task
# data" / "Unable to open static sorted file ... .sst". Recovery is exactly:
# stop the dev server, rm -rf .next, restart. Source is never affected.

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

- [x] Product page with required size selector + fulfillment message
- [x] Catalog + home pages
- [x] Sanity product catalog (schema, GROQ, seed) — `lib/rings.ts` reads Sanity
- [x] Zustand cart (+ localStorage persistence) — `store/cart.ts`, resolved for
      display through `app/actions/cart.ts`
- [x] Stripe hosted Checkout (`/api/checkout`) + success / cancel pages
- [x] Sanity → revalidateTag webhook for instant content updates
      (`/api/revalidate`; still needs to be wired up as a webhook in Studio,
      with `SANITY_REVALIDATE_SECRET` set to match)
- [ ] Resend domain verification (sender: uzsakymai@mirga.lab)
- [ ] Real per-product photography — the seeded rings share a pool of 8 photos
- [ ] `/api/webhook` is the remaining half of the payment flow: verify the
      signature off the raw body, flip `ready -> false` for consumed units, send
      the Resend confirmation. Until it exists, a paid order does not update
      `ready` and sends no email — the Stripe Dashboard is the only record.
- [x] Legal pages (terms, privacy, returns) — `lib/legal.ts` +
      `app/[locale]/terms|privacy|returns/page.tsx`. Seller identity
      (`SELLER.name`/`SELLER.id` in `lib/legal.ts`) is still a bracketed
      placeholder — fill in the real legal entity name and registration number,
      and have the made-to-order/custom-goods withdrawal-right exception
      checked against current VVTAT guidance, before launch. The FAQ already
      states this policy in plain language (`lib/faq.ts`, `returns` group) —
      keep the two in step, and treat the legal page as the authoritative
      wording.
- [x] Cookie consent + analytics — Vercel Web Analytics (`@vercel/analytics`,
      mounted in `app/[locale]/layout.tsx`) plus `components/CookieNotice.tsx`.
      Vercel Web Analytics is cookieless and collects no personal data, and the
      cart's localStorage use is strictly necessary (ePrivacy Art. 5(3)
      exemption), so neither legally requires opt-in consent — the banner is a
      dismiss-once transparency notice, not a consent gate. Revisit if a
      cookie-based tool (e.g. Google Analytics, marketing pixels) is ever added.
- [x] Stripe Tax (EU VAT) before launch — code is ready
      (`STRIPE_TAX_ENABLED`, inclusive `tax_behavior` on every price and on
      shipping, see "Taxes" above), but stays off until the Stripe Dashboard
      has an origin address + tax registration configured and the seller's
      actual VAT/OSS registration status is decided — flipping the flag
      without that breaks every checkout.
- [ ] Translate the Stripe line-item descriptions + Resend email per locale
      (product content itself is already localised in Sanity)
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
