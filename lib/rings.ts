import { defaultLocale, type Locale } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  allProductsQuery,
  productBySlugQuery,
  productSlugsQuery,
} from "@/sanity/lib/queries";

type Localized<T> = Partial<Record<Locale, T>>;

/**
 * What Sanity returns: everything locale-independent inline, every piece of
 * copy as a `{ lt, en }` object. Slugs are shared across locales on purpose —
 * one canonical URL per product, and cart keys stay valid when the visitor
 * switches language.
 */
type RingSource = {
  id: string;
  slug: string;
  price: number; // EUR
  /** Stable id for filtering — the visible material label is localised. */
  materialKey: string;
  imageRefs: string[] | null;
  sizeOptions: string[] | null;
  ready: boolean | null;
  readySize?: string | null;
  featured: boolean;
  order: number;
  title: Localized<string> | null;
  material: Localized<string> | null;
  description: Localized<string> | null;
  details: Localized<string[]> | null;
};

/** What components consume: one locale already resolved. */
export type RingProduct = {
  id: string;
  slug: string;
  price: number;
  materialKey: string;
  images: string[];
  sizeOptions: string[];
  ready: boolean;
  readySize?: string;
  featured: boolean;
  title: string;
  material: string;
  description: string;
  details: string[];
};

/**
 * Only the default locale is required in Studio, so a half-finished English
 * translation falls back to Lithuanian rather than rendering an empty heading.
 */
function pick<T>(field: Localized<T> | null, locale: Locale, fallback: T): T {
  return field?.[locale] ?? field?.[defaultLocale] ?? fallback;
}

// Sanity serves the original upload; ask the CDN for a sensible delivery size
// and let it pick the format. 1200px covers the product gallery, and the same
// URL is reused for cards — one width keeps the cache hot.
const IMAGE_WIDTH = 1200;

function localize(source: RingSource, locale: Locale): RingProduct {
  return {
    id: source.id,
    slug: source.slug,
    price: source.price,
    materialKey: source.materialKey,
    images: (source.imageRefs ?? []).map((ref) =>
      urlFor(ref).width(IMAGE_WIDTH).quality(85).auto("format").url(),
    ),
    sizeOptions: source.sizeOptions ?? [],
    ready: source.ready ?? false,
    readySize: source.readySize ?? undefined,
    featured: source.featured,
    title: pick(source.title, locale, ""),
    material: pick(source.material, locale, ""),
    description: pick(source.description, locale, ""),
    details: pick(source.details, locale, []),
  };
}

/** Every renderable ring, in catalog order. */
export async function getRings(locale: Locale): Promise<RingProduct[]> {
  const sources = await sanityFetch<RingSource[]>(allProductsQuery);
  return sources.map((r) => localize(r, locale));
}

/** The home-page row. Falls back to the newest rings if nothing is flagged, so
 *  the section is never empty just because the owner hasn't ticked a box. */
export async function getFeaturedRings(
  locale: Locale,
  limit = 4,
): Promise<RingProduct[]> {
  const rings = await getRings(locale);
  const flagged = rings.filter((r) => r.featured);
  return (flagged.length > 0 ? flagged : rings).slice(0, limit);
}

/** Slugs alone — for generateStaticParams, which needs no copy. */
export async function getRingSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(productSlugsQuery);
}

/**
 * The union of every ring's sizes, for the catalog's size filter. Derived from
 * the live catalog rather than hardcoded, so adding a size in Studio adds the
 * chip. The catalog page passes this into the client component — a module-level
 * constant can't be awaited in the browser.
 */
export async function getRingSizes(): Promise<string[]> {
  const rings = await sanityFetch<Pick<RingSource, "sizeOptions">[]>(
    allProductsQuery,
  );
  return Array.from(
    new Set(rings.flatMap((r) => r.sizeOptions ?? [])),
  ).sort((a, b) => Number(a) - Number(b));
}

export async function getRingBySlug(
  slug: string,
  locale: Locale,
): Promise<RingProduct | undefined> {
  const source = await sanityFetch<RingSource | null>(productBySlugQuery, {
    slug,
  });
  return source ? localize(source, locale) : undefined;
}

// Same material first, then anything else — never the ring itself.
export async function getRelatedRings(
  slug: string,
  locale: Locale,
  limit = 4,
): Promise<RingProduct[]> {
  const rings = await getRings(locale);
  const current = rings.find((r) => r.slug === slug);
  const others = rings.filter((r) => r.slug !== slug);
  const ordered = current
    ? [
        ...others.filter((r) => r.materialKey === current.materialKey),
        ...others.filter((r) => r.materialKey !== current.materialKey),
      ]
    : others;

  return ordered.slice(0, limit);
}
