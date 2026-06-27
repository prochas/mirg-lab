# CLAUDE.md

Context for AI assistants working in this repository. Read this fully before
making changes. Prefer the conventions here over generic defaults.

## Project

**mirga.lab** — an e-commerce shop selling handmade jewelry, primarily rings of
the owner's own design. This is an MVP. Keep it lean: do not add infrastructure,
abstractions, or features that aren't needed yet.

The shop UI is in **Lithuanian**. Prices and currency are **EUR**. Customers are
mostly in the EU (Lithuania first).

## Tech stack

- **Next.js 16** (App Router, TypeScript, `src/` directory, import alias `@/*`)
- **Tailwind CSS**
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

```
src/
  app/
    (shop)/
      page.tsx                 # home
      products/page.tsx        # catalog
      products/[slug]/page.tsx # product page (size selection + fulfillment msg)
      cart/page.tsx
      success/page.tsx
      cancel/page.tsx          # (or reuse /cart as cancel target)
    api/
      checkout/route.ts        # POST: builds Stripe Checkout Session (price from Sanity)
      webhook/route.ts         # POST: verifies signature, flips ready->false, sends email
    studio/[[...tool]]/page.tsx # embedded Sanity Studio
  lib/
    stripe.ts                  # Stripe SDK singleton
    fulfillment.ts             # getFulfillment() — the shared business logic
    email.ts                   # Resend order confirmation
  sanity/
    client.ts                  # read client + server-only write client + GROQ
    schemaTypes/
      product.ts
      index.ts
  store/                       # cart (Zustand) — planned
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
   `getFulfillment(product, size).message`.
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
- UI copy in Lithuanian; code/comments may be English.
- Prefer Server Components + GROQ for data fetching; client components only for
  interactivity (cart, size selection).

## TODO / not yet built

- [ ] Product page with required size selector + fulfillment message
- [ ] Zustand cart (+ localStorage persistence)
- [ ] Catalog + home pages
- [ ] success / cancel pages
- [ ] Resend domain verification (sender: uzsakymai@mirga.lab)
- [ ] Sanity → revalidateTag webhook for instant content updates
- [ ] Legal pages (terms, privacy, returns — note the made-to-order/custom-goods
      exception to the EU 14-day withdrawal right; verify with VVTAT guidance)
- [ ] Cookie consent + analytics
- [ ] Stripe Tax (EU VAT) before launch

## Project facts to confirm / fill in

- Node version:  v22.
- Package manager: ___ (npm / pnpm / yarn)
- Deploy target: Vercel
- Production domain: https://mirgalab.com
- Shipping countries: LT and other EU countries
