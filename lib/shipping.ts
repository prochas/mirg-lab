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

/**
 * Parcel locker delivery only ever goes through this one country — the
 * picker (`lib/lockers.ts`) only ever offers Lithuanian Omniva terminals, so
 * there's nothing to ship a locker order to outside Lithuania.
 */
export const LOCKER_COUNTRIES = ["LT"] as const;

/**
 * Paid rates, applied only below the free-shipping threshold. `locker` is
 * cheaper than `home` — a parcel locker costs the carrier less to serve than
 * a door delivery.
 */
export const SHIPPING_RATES = {
  domestic: {
    home: { cents: 390, days: { min: 1, max: 3 } },
    locker: { cents: 290, days: { min: 1, max: 3 } },
  },
  eu: {
    home: { cents: 990, days: { min: 3, max: 7 } },
  },
} as const;

/** Delivery estimate shown on the free options. */
const FREE_DAYS = { min: 1, max: 7 };

export type DeliveryMethod = "home" | "locker";

type ShippingOptionLabels = {
  /** e.g. "Pristatymas į namus (Lietuva)" — only used for method "home". */
  domesticHome: string;
  /** e.g. "Pristatymas į namus (kitos ES šalys)" — only used for method "home". */
  euHome: string;
  /** e.g. "Paštomatas (Omniva)" — only used for method "locker". */
  locker: string;
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
 * The shipping choice(s) offered for a given order value and delivery method.
 *
 * `subtotalEur` **must** be computed from Sanity prices on the server. Deciding
 * free shipping from a client-supplied total would let anyone claim it.
 *
 * The delivery *method* (home vs. locker) is decided client-side before the
 * Checkout Session is even created (see the locker picker in `CartDrawer`),
 * so unlike the zone below, it never needs to be a Stripe-side choice.
 *
 * For `method: "locker"` there is exactly one rate — Lithuania only, since
 * that's the only country the picker offers terminals for. For `method:
 * "home"` the *zone* (domestic vs. EU) is still the customer's choice at
 * Stripe: `shipping_options` is fixed at session creation, so it can't react
 * to the address typed in afterwards. (A future upgrade would collect the
 * country before creating the session, or move to Stripe's dynamic shipping.)
 */
export function shippingOptionsFor(
  subtotalEur: number,
  method: DeliveryMethod,
  labels: ShippingOptionLabels,
) {
  const free = subtotalEur >= FREE_SHIPPING_FROM;

  if (method === "locker") {
    const { cents, days } = SHIPPING_RATES.domestic.locker;
    return [rate(labels.locker, free ? 0 : cents, free ? FREE_DAYS : days)];
  }

  return [
    rate(
      labels.domesticHome,
      free ? 0 : SHIPPING_RATES.domestic.home.cents,
      free ? FREE_DAYS : SHIPPING_RATES.domestic.home.days,
    ),
    rate(
      labels.euHome,
      free ? 0 : SHIPPING_RATES.eu.home.cents,
      free ? FREE_DAYS : SHIPPING_RATES.eu.home.days,
    ),
  ];
}
