import Stripe from "stripe";

/**
 * Server-only Stripe client.
 *
 * The key is read lazily inside the getter, not at module scope: importing this
 * file must never throw, or an unrelated build step that happens to pull it in
 * fails on a machine without Stripe credentials.
 *
 * `STRIPE_SECRET_KEY` has no `NEXT_PUBLIC_` prefix, so Next refuses to inline it
 * into a client bundle. Never import this from a client component.
 */
let cached: Stripe | null = null;

export function getStripe() {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
  }

  // No explicit apiVersion — the SDK pins the version it was built against,
  // which is what its types describe. Overriding with a hand-written string is
  // how you get responses that don't match the types.
  cached = new Stripe(key, { typescript: true });
  return cached;
}
