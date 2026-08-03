import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import type Stripe from "stripe";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  sendOrderConfirmation,
  type OrderConfirmationAddress,
} from "@/lib/email";
import { getFulfillmentStatus } from "@/lib/fulfillment";
import { getStripe } from "@/lib/stripe";
import { getWriteClient } from "@/sanity/lib/client";
import { productsReadyQuery } from "@/sanity/lib/queries";

// The Stripe SDK needs Node APIs; it does not run on the edge runtime.
export const runtime = "nodejs";
// Verifying a webhook is a side effect and must never be prerendered or cached.
export const dynamic = "force-dynamic";

type OrderLine = {
  name: string;
  description: string;
  quantity: number;
  amountTotal: number;
  productId?: string;
  size?: string;
  image?: string;
};

/**
 * Verifies the signature off the *raw* body, flips `ready -> false` for any
 * line that consumed an on-hand unit, and sends the Resend confirmation.
 *
 * Only `checkout.session.completed` is handled. This shop's Checkout Sessions
 * don't set `payment_method_types` (Stripe picks based on Dashboard settings),
 * so if an asynchronous method (e.g. SEPA Debit) is ever enabled there, this
 * would also need `checkout.session.async_payment_succeeded` — skipped for now
 * since only card is in use and `payment_status` is already "paid" by the time
 * "completed" fires for it.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("webhook: STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  // Must be the untouched raw body — `req.json()` would already have
  // consumed/reserialized it, which breaks signature verification.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error("webhook: signature verification failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  try {
    await handleCompletedSession(session);
  } catch (error) {
    // A non-2xx tells Stripe to retry — a transient Sanity/Resend failure
    // should not be treated as a dead letter.
    console.error("webhook: failed to process session", session.id, error);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCompletedSession(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  const lines: OrderLine[] = lineItems.data.map((item) => {
    const product =
      item.price && typeof item.price.product === "object" && "metadata" in item.price.product
        ? (item.price.product as Stripe.Product)
        : undefined;

    return {
      name: product?.name ?? item.description ?? "",
      // `item.description` defaults to the product *name* — the material ·
      // size · fulfillment blurb set in /api/checkout only lives on the
      // expanded product's own `description` field.
      description: product?.description ?? "",
      quantity: item.quantity ?? 1,
      amountTotal: item.amount_total ?? 0,
      // Set on `price_data.product_data.metadata` in /api/checkout, precisely
      // so this webhook can identify which Sanity doc + size were sold.
      productId: product?.metadata?.productId,
      size: product?.metadata?.size,
      // Same image shown at checkout — set via `product_data.images` in
      // /api/checkout, not re-fetched from Sanity.
      image: product?.images?.[0],
    };
  });

  await flipConsumedUnits(lines);

  const email = session.customer_details?.email;
  if (!email) return;

  const rawLocale = session.metadata?.locale;
  const locale: Locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  const shipping = session.collected_information?.shipping_details;
  const billing = session.customer_details;

  await sendOrderConfirmation({
    to: email,
    locale,
    reference: session.id.slice(-8).toUpperCase(),
    currency: session.currency ?? "eur",
    subtotal: session.amount_subtotal ?? 0,
    shippingCost: session.shipping_cost?.amount_total ?? 0,
    discount: session.total_details?.amount_discount ?? 0,
    amountTotal: session.amount_total ?? 0,
    lines,
    // Set in /api/checkout's session metadata only for locker delivery — the
    // exact terminal the customer picked in the map, not a free-typed guess.
    locker: session.metadata?.locker,
    shippingAddress: toAddress(shipping?.name, shipping?.address),
    billingAddress: toAddress(billing?.name, billing?.address),
    paymentMethod: await describePaymentMethod(session.payment_intent),
    viewOrderUrl: buildViewOrderUrl(session.id, locale),
  });
}

function toAddress(
  name: string | null | undefined,
  address: Stripe.Address | null | undefined,
): OrderConfirmationAddress | undefined {
  // A missing line1/city/country means Stripe never actually collected one
  // (e.g. `billing_address_collection: "auto"` didn't require it) — better
  // to omit the block in the email than show a half-empty address.
  if (!address?.line1 || !address.city || !address.country) return undefined;
  return {
    name: name ?? undefined,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    postalCode: address.postal_code ?? "",
    country: address.country,
  };
}

/**
 * "Visa •••• 4242" — a cosmetic addition to the confirmation email, so a
 * failed lookup here should never break sending it. Needs its own API call:
 * webhook payloads don't expand `payment_intent.payment_method`.
 */
async function describePaymentMethod(
  paymentIntent: string | Stripe.PaymentIntent | null,
): Promise<string | undefined> {
  if (!paymentIntent) return undefined;
  const id = typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;

  try {
    const intent = await getStripe().paymentIntents.retrieve(id, {
      expand: ["payment_method"],
    });
    const method = intent.payment_method;
    if (!method || typeof method === "string" || !method.card) return undefined;

    const brand = method.card.brand;
    const brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1);
    return `${brandLabel} •••• ${method.card.last4}`;
  } catch (error) {
    console.error("webhook: failed to read payment method", error);
    return undefined;
  }
}

/** The "View your order" button in the confirmation email — reuses the
 *  existing `/success` page rather than building a new one. */
function buildViewOrderUrl(sessionId: string, locale: Locale): string | undefined {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return undefined;
  const origin = baseUrl.replace(/\/$/, "");
  return `${origin}${getPathname({ href: "/success", locale })}?session_id=${sessionId}`;
}

/**
 * Flips `ready -> false` for any sold line that consumed the on-hand unit
 * (`ready_exact` or `ready_resize`). Not load-bearing for correctness — every
 * product is always orderable regardless — this only keeps the displayed
 * message accurate for the next visitor.
 */
async function flipConsumedUnits(lines: OrderLine[]) {
  const ids = [
    ...new Set(
      lines.map((l) => l.productId).filter((id): id is string => Boolean(id)),
    ),
  ];
  if (ids.length === 0) return;

  const client = getWriteClient();
  const products = await client.fetch<
    { id: string; ready: boolean | null; readySize: string | null }[]
  >(productsReadyQuery, { ids });
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const line of lines) {
    if (!line.productId || !line.size) continue;

    const product = byId.get(line.productId);
    if (!product?.ready) continue;

    const status = getFulfillmentStatus(
      { ready: product.ready, readySize: product.readySize ?? undefined },
      line.size,
    );
    if (status === "made_to_order") continue;

    await client.patch(line.productId).set({ ready: false }).commit();
  }
}
