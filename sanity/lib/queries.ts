import { defineQuery } from 'next-sanity'

/**
 * Shared projection for a ring.
 *
 * Translatable fields come back as whole `{ lt, en }` objects and are resolved
 * in `lib/rings.ts`. That's deliberate: doing it here would mean a
 * `select($locale == "en" => ..., ...)` per field, repeated in every query, and
 * a locale fallback that GROQ can't express cleanly.
 *
 * `materialKey` is the locale-stable filter id; `material` is the translated
 * label. The catalog filters on the former and only ever displays the latter.
 *
 * Images come back as bare asset refs — `lib/rings.ts` turns them into sized
 * CDN URLs. `images[defined(asset)]` skips array slots the editor added but
 * never uploaded into, which would otherwise surface as a null src.
 */
const PRODUCT_FIELDS = /* groq */ `
  "id": _id,
  "slug": slug.current,
  price,
  title,
  description,
  details,
  sizeOptions,
  ready,
  readySize,
  "featured": coalesce(featured, false),
  "order": coalesce(order, 0),
  "materialKey": material->key.current,
  "material": material->title,
  "imageRefs": images[defined(asset)].asset._ref
`

/** Catalog order: explicit `order` first, then name — matches Studio's ordering. */
const CATALOG_ORDER = /* groq */ `order(order asc, title.lt asc)`

/**
 * Only products that are published and complete enough to render.
 *
 * The drafts exclusion is load-bearing: this dataset is read without a token, so
 * on a public dataset every `drafts.*` document would otherwise come back and
 * an unfinished ring would appear in the shop. A draft missing its material
 * reference would also crash the card on a null label.
 */
const RENDERABLE = /* groq */ `
  _type == "product"
  && !(_id in path("drafts.**"))
  && defined(slug.current)
  && defined(material->key.current)
`

export const allProductsQuery = defineQuery(`
  *[${RENDERABLE}] | ${CATALOG_ORDER} {${PRODUCT_FIELDS}}
`)

export const productBySlugQuery = defineQuery(`
  *[${RENDERABLE} && slug.current == $slug][0] {${PRODUCT_FIELDS}}
`)

/** Slugs alone, for generateStaticParams — no copy, no joins, order irrelevant. */
export const productSlugsQuery = defineQuery(`
  *[${RENDERABLE}].slug.current
`)

/**
 * Checkout reads prices straight from here — the client only ever sends
 * { id, size, qty }, never an amount.
 *
 * `sizeOptions` is included so the route can reject a size that isn't actually
 * offered, and `title`/`material` come back as `{ lt, en }` so the Stripe line
 * item is in the customer's language.
 */
export const productsByIdsQuery = defineQuery(`
  *[_type == "product" && !(_id in path("drafts.**")) && _id in $ids] {
    "id": _id,
    price,
    ready,
    readySize,
    sizeOptions,
    title,
    "material": material->title,
    "slug": slug.current,
    "imageRef": images[defined(asset)][0].asset._ref
  }
`)

/**
 * `ready`/`readySize` only — what the webhook reads right before deciding
 * whether a line it just sold should flip `ready -> false`. Read through the
 * write client (no CDN), so the value is current at the moment of the sale.
 */
export const productsReadyQuery = defineQuery(`
  *[_type == "product" && _id in $ids] {
    "id": _id,
    ready,
    readySize
  }
`)
