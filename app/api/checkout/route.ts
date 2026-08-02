import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type Stripe from "stripe";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { MAX_QTY } from "@/lib/cart";
import { getFulfillment } from "@/lib/fulfillment";
import { SHIPPING_COUNTRIES, shippingOptionsFor } from "@/lib/shipping";
import { getStripe } from "@/lib/stripe";
import { sanityFetchFresh } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { productsByIdsQuery } from "@/sanity/lib/queries";

// Stripe's SDK needs Node APIs; it does not run on the edge runtime.
export const runtime = "nodejs";
// Creating a Checkout Session is a side effect. It must never be prerendered or
// cached — every request has to execute.
export const dynamic = "force-dynamic";

/** Matches the store's own cap; anything larger is not a real order. */
const MAX_LINES = 50;
/** Stripe rejects metadata values over 500 characters. */
const METADATA_VALUE_LIMIT = 500;

/**
 * What Sanity gives us. Note what is absent: anything price-shaped that the
 * client could have influenced.
 */
type CheckoutProduct = {
  id: string;
  price: number | null;
  ready: boolean | null;
  readySize: string | null;
  sizeOptions: string[] | null;
  title: Partial<Record<Locale, string>> | null;
  material: Partial<Record<Locale, string>> | null;
  slug: string | null;
  imageRef: string | null;
};

type ValidLine = { id: string; size: string; qty: number };

function fail(code: string, status = 400) {
  return NextResponse.json({ error: code }, { status });
}

/**
 * Reads only `id`, `size` and `qty`, and only in the expected shapes.
 *
 * Anything else in the payload — `price`, `amount`, `total`, `currency` — is
 * never looked at, so sending it has no effect. This is the crux of the
 * security model: the request cannot express a price.
 */
function parseLines(raw: unknown): ValidLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  if (raw.length > MAX_LINES) return null;

  const lines: ValidLine[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const { id, size, qty } = entry as Record<string, unknown>;

    if (typeof id !== "string" || !id || id.length > 200) return null;
    if (typeof size !== "string" || !size || size.length > 20) return null;
    if (typeof qty !== "number" || !Number.isFinite(qty)) return null;

    const n = Math.floor(qty);
    if (n < 1) return null;
    lines.push({ id, size, qty: Math.min(n, MAX_QTY) });
  }

  // Two lines for the same ring+size would bill it twice at half the quantity.
  const keys = new Set(lines.map((l) => `${l.id}__${l.size}`));
  if (keys.size !== lines.length) return null;

  return lines;
}

export async function POST(req: Request) {
  // ── 1. Parse and shape-check the request ──────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("bad_request");
  }

  const { items, locale: rawLocale } = (body ?? {}) as Record<string, unknown>;

  const locale: Locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  const lines = parseLines(items);
  if (!lines) return fail("invalid_cart");

  // ── 2. Load the real products, uncached ───────────────────────────────────
  const products = await sanityFetchFresh<CheckoutProduct[]>(
    productsByIdsQuery,
    { ids: lines.map((l) => l.id) },
  );
  const byId = new Map(products.map((p) => [p.id, p]));

  const t = await getTranslations({ locale, namespace: "fulfillment" });
  const tCheckout = await getTranslations({ locale, namespace: "checkout" });

  // ── 3. Build the line items, pricing every one from Sanity ────────────────
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: string[] = [];
  let subtotalEur = 0;

  for (const line of lines) {
    const product = byId.get(line.id);
    // Unknown, unpublished or deleted. Refused rather than skipped: silently
    // dropping a line would charge for an order the customer didn't place.
    if (!product) return fail("unknown_product");

    // A price that isn't a positive number would otherwise become a €0 order.
    const price = product.price;
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return fail("unavailable");
    }

    // The size has to be one actually offered, or the order is unfulfillable.
    const sizes = product.sizeOptions ?? [];
    if (!sizes.includes(line.size)) return fail("invalid_size");

    const title =
      product.title?.[locale] ??
      product.title?.[routing.defaultLocale] ??
      product.slug ??
      "";
    const material =
      product.material?.[locale] ?? product.material?.[routing.defaultLocale];

    const fulfillment = getFulfillment(
      { ready: product.ready ?? false, readySize: product.readySize ?? undefined },
      line.size,
      t,
    );

    // EUR -> cents, on the server, from the Sanity price.
    const unitAmount = Math.round(price * 100);
    subtotalEur += price * line.qty;

    lineItems.push({
      quantity: line.qty,
      price_data: {
        currency: "eur",
        unit_amount: unitAmount,
        product_data: {
          name: title,
          // Size, material and the delivery expectation, so the Stripe receipt
          // and the Dashboard show exactly what was ordered.
          description: [
            material,
            tCheckout("sizeLabel", { size: line.size }),
            fulfillment.short,
          ]
            .filter(Boolean)
            .join(" · "),
          ...(product.imageRef
            ? { images: [urlFor(product.imageRef).width(600).url()] }
            : {}),
          metadata: { productId: product.id, size: line.size },
        },
      },
    });

    summary.push(`${product.slug ?? product.id}:${line.size}:${line.qty}:${fulfillment.status}`);
  }

  // ── 4. Metadata, within Stripe's 500-char ceiling ─────────────────────────
  const itemsMeta = summary.join("|");
  if (itemsMeta.length > METADATA_VALUE_LIMIT) return fail("cart_too_large");

  // ── 5. Redirect targets. Built from server env, never from a request header,
  //       so the Host header can't turn this into an open redirect. ──────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.error("checkout: NEXT_PUBLIC_BASE_URL is not set");
    return fail("misconfigured", 500);
  }
  const origin = baseUrl.replace(/\/$/, "");
  const absoluteUrl = (href: string) =>
    `${origin}${getPathname({ href, locale })}`;

  // ── 6. Create the session ─────────────────────────────────────────────────
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Codes are created/managed in the Stripe Dashboard — no coupon logic
      // or code validation of our own.
      allow_promotion_codes: true,
      // Guest checkout — Stripe collects the email, we store no accounts.
      customer_creation: "if_required",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [...SHIPPING_COUNTRIES],
      },
      // Free above the threshold, decided from the Sanity subtotal above.
      shipping_options: shippingOptionsFor(subtotalEur, {
        domestic: tCheckout("shipping.domestic"),
        eu: tCheckout("shipping.eu"),
        free: tCheckout("shipping.free"),
      }),
      locale,
      success_url: `${absoluteUrl("/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl("/cancel"),
      metadata: { items: itemsMeta, locale },
    });

    if (!session.url) return fail("stripe_error", 502);
    // Only the redirect target goes back — no ids, no amounts, nothing internal.
    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Stripe errors can carry account details; log server-side, return a code.
    console.error("checkout: Stripe session creation failed", error);
    return fail("stripe_error", 502);
  }
}
