import { getFulfillment, type Fulfillment } from "./fulfillment";
import { getRingBySlug, type RingProduct } from "./rings";

// UI mock only — there is no cart state yet. When the real cart lands it will
// store exactly this shape ({ id, size, qty }, never prices) per CLAUDE.md.
export type CartLine = { slug: string; size: string; qty: number };

export const mockCart: CartLine[] = [
  { slug: "bangele", size: "18", qty: 1 }, // ready in this exact size
  { slug: "uola", size: "17", qty: 2 }, // made to order
  { slug: "akmenukas", size: "18", qty: 1 }, // ready, needs resizing
];

/** Free shipping threshold in EUR — matches the product page delivery note. */
export const FREE_SHIPPING_FROM = 100;

export type CartItem = CartLine & {
  product: RingProduct;
  fulfillment: Fulfillment;
  lineTotal: number;
};

/** Resolves mock lines against the catalog for display. No state, no mutation. */
export function resolveCart(lines: CartLine[]): CartItem[] {
  return lines.flatMap((line) => {
    const product = getRingBySlug(line.slug);
    if (!product) return [];
    return [
      {
        ...line,
        product,
        fulfillment: getFulfillment(product, line.size),
        lineTotal: product.price * line.qty,
      },
    ];
  });
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.lineTotal, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
