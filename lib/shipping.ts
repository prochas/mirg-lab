import { FREE_SHIPPING_FROM } from "./cart";

/**
 * Shipping configuration. Rates live here as plain constants so they can be
 * changed without touching checkout logic.
 *
 * Amounts are in **euro cents** — that is what Stripe charges, and keeping them
 * in cents here avoids a float rounding step at the point of sale.
 */

/** Every EU member state. Stripe validates the delivery address against this. */
export const SHIPPING_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

/** Paid rates, applied only below the free-shipping threshold. */
export const SHIPPING_RATES = {
  domestic: { cents: 390, days: { min: 1, max: 3 } },
  eu: { cents: 990, days: { min: 3, max: 7 } },
} as const;

/** Delivery estimate shown on the free option. */
const FREE_DAYS = { min: 1, max: 7 };

type ShippingOptionLabels = {
  /** e.g. "Lietuva" */
  domestic: string;
  /** e.g. "Kitos ES šalys" */
  eu: string;
  /** e.g. "Nemokamas siuntimas" */
  free: string;
};

function rate(
  label: string,
  cents: number,
  days: { min: number; max: number },
) {
  return {
    shipping_rate_data: {
      type: "fixed_amount" as const,
      fixed_amount: { amount: cents, currency: "eur" },
      display_name: label,
      delivery_estimate: {
        minimum: { unit: "business_day" as const, value: days.min },
        maximum: { unit: "business_day" as const, value: days.max },
      },
      // Matches the line items: this amount is what's charged regardless of
      // the buyer's EU country. With Stripe Tax on, VAT is broken out of it
      // rather than added on top — see the `automatic_tax` note in
      // app/api/checkout/route.ts.
      tax_behavior: "inclusive" as const,
    },
  };
}

/**
 * The shipping choices offered for a given order value.
 *
 * `subtotalEur` **must** be computed from Sanity prices on the server. Deciding
 * free shipping from a client-supplied total would let anyone claim it.
 *
 * Above the threshold this returns a single free option, so there is nothing to
 * choose and nothing to get wrong. Below it, both zone rates are offered:
 * Stripe fixes `shipping_options` when the session is created, so they cannot
 * react to the address the customer subsequently types in. The zone is
 * therefore the customer's selection, and the Dashboard shows the address next
 * to the rate they picked. (A future upgrade would collect the country before
 * creating the session, or move to Stripe's dynamic shipping.)
 */
export function shippingOptionsFor(
  subtotalEur: number,
  labels: ShippingOptionLabels,
) {
  if (subtotalEur >= FREE_SHIPPING_FROM) {
    return [rate(labels.free, 0, FREE_DAYS)];
  }

  return [
    rate(labels.domestic, SHIPPING_RATES.domestic.cents, SHIPPING_RATES.domestic.days),
    rate(labels.eu, SHIPPING_RATES.eu.cents, SHIPPING_RATES.eu.days),
  ];
}
