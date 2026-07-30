export type FulfillmentStatus = "ready_exact" | "ready_resize" | "made_to_order";

export type Fulfillment = {
  status: FulfillmentStatus;
  /** Full sentence for the product page / cart. */
  message: string;
  /** Compact label for badges and line items. */
  short: string;
};

/**
 * A next-intl translator scoped to the `fulfillment` namespace — satisfied by
 * both `useTranslations("fulfillment")` (client) and
 * `await getTranslations("fulfillment")` (server).
 */
export type FulfillmentTranslator = (
  key: string,
  values?: Record<string, string>,
) => string;

/**
 * Which of the three states applies. Locale-independent, so anything that only
 * needs to branch on the state (badges, Stripe metadata, the webhook deciding
 * whether to flip `ready`) can use this without dragging translations in.
 */
export function getFulfillmentStatus(
  product: { ready: boolean; readySize?: string },
  chosenSize: string,
): FulfillmentStatus {
  if (product.ready && product.readySize === chosenSize) return "ready_exact";
  if (product.ready) return "ready_resize";
  return "made_to_order";
}

/**
 * Single source of truth for the customer-facing fulfillment message.
 * Used by the product page, the cart, and (later) the checkout route so the
 * same wording reaches Stripe metadata and the confirmation email.
 *
 * Nothing here gates ordering — every piece is always orderable.
 *
 * Copy lives in `messages/<locale>.json` under `fulfillment`; the caller passes
 * its translator in so this stays one function rather than one per locale.
 */
export function getFulfillment(
  product: { ready: boolean; readySize?: string },
  chosenSize: string,
  t: FulfillmentTranslator,
): Fulfillment {
  const status = getFulfillmentStatus(product, chosenSize);

  if (status === "ready_exact") {
    return {
      status,
      message: t("readyExact.message"),
      short: t("readyExact.short"),
    };
  }

  if (status === "ready_resize") {
    return {
      status,
      message: t("readyResize.message", {
        readySize: product.readySize ?? "",
        chosenSize,
      }),
      short: t("readyResize.short"),
    };
  }

  return {
    status,
    message: t("madeToOrder.message"),
    short: t("madeToOrder.short"),
  };
}
