import type { Locale } from "@/i18n/routing";
import {
  getFulfillment,
  type Fulfillment,
  type FulfillmentTranslator,
} from "./fulfillment";
import { getRings } from "./rings";

/**
 * What the cart stores — and all it stores. No prices, no titles: those are
 * resolved from Sanity server-side, so nothing the browser can edit affects
 * what the customer is charged.
 *
 * `id` is the Sanity document id (the same key `productsByIdsQuery` reads).
 */
export type CartLine = { id: string; size: string; qty: number };

/** Same ring in two sizes = two lines, so size is part of the identity. */
export function cartKey(line: { id: string; size: string }) {
  return `${line.id}__${line.size}`;
}

/** Per-line cap. Anything above this is a mis-click, not an order. */
export const MAX_QTY = 10;

/** Free shipping threshold in EUR — matches the product page delivery note. */
export const FREE_SHIPPING_FROM = 100;

/**
 * A resolved line, flattened for the drawer.
 *
 * Deliberately *not* the whole `RingProduct`: this crosses the network on every
 * resolve, and the drawer needs a thumbnail and a name, not the description and
 * spec bullets.
 */
export type CartItem = CartLine & {
  key: string;
  slug: string;
  title: string;
  material: string;
  image?: string;
  unitPrice: number;
  lineTotal: number;
  fulfillment: Fulfillment;
};

/**
 * Resolves cart lines against the catalog for display. No state, no mutation.
 * `t` is a translator scoped to the `fulfillment` namespace.
 *
 * Server-only in practice — the catalog lives in Sanity. The whole catalog is
 * fetched once and indexed rather than one query per line, so this is a single
 * cached request regardless of cart size.
 *
 * Lines whose product no longer resolves (deleted or unpublished in Studio) are
 * dropped rather than rendered as a broken row; the store prunes them to match.
 */
export async function resolveCart(
  lines: CartLine[],
  locale: Locale,
  t: FulfillmentTranslator,
): Promise<CartItem[]> {
  if (lines.length === 0) return [];

  const byId = new Map((await getRings(locale)).map((ring) => [ring.id, ring]));

  return lines.flatMap((line) => {
    const product = byId.get(line.id);
    if (!product) return [];

    // A size that vanished from Studio would make getFulfillment report a
    // resize against a size the customer can no longer pick.
    const size = product.sizeOptions.includes(line.size)
      ? line.size
      : (product.sizeOptions[0] ?? line.size);

    const qty = Math.min(Math.max(1, line.qty), MAX_QTY);

    return [
      {
        id: line.id,
        size,
        qty,
        key: cartKey({ id: line.id, size: line.size }),
        slug: product.slug,
        title: product.title,
        material: product.material,
        image: product.images[0],
        unitPrice: product.price,
        lineTotal: product.price * qty,
        fulfillment: getFulfillment(product, size, t),
      },
    ];
  });
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.lineTotal, 0);
}

/** Badge count — reads the lines directly so callers needn't resolve the catalog. */
export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
