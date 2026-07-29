export type FulfillmentStatus = "ready_exact" | "ready_resize" | "made_to_order";

export type Fulfillment = {
  status: FulfillmentStatus;
  /** Full sentence for the product page / cart. */
  message: string;
  /** Compact label for badges and line items. */
  short: string;
};

/**
 * Single source of truth for the customer-facing fulfillment message.
 * Used by the product page, the cart, and (later) the checkout route so the
 * same wording reaches Stripe metadata and the confirmation email.
 *
 * Nothing here gates ordering — every piece is always orderable.
 */
export function getFulfillment(
  product: { ready: boolean; readySize?: string },
  chosenSize: string,
): Fulfillment {
  if (product.ready && product.readySize === chosenSize) {
    return {
      status: "ready_exact",
      message: "Šis žiedas jau paruoštas — išsiunčiame per 1–2 darbo dienas.",
      short: "Išsiunčiame per 1–2 d. d.",
    };
  }

  if (product.ready) {
    return {
      status: "ready_resize",
      message: `Turime paruoštą ${product.readySize} dydžio vienetą — pakeisime į ${chosenSize}, tai užtrunka 1–2 darbo dienas.`,
      short: "Dydžio keitimas 1–2 d. d.",
    };
  }

  return {
    status: "made_to_order",
    message: "Gaminama pagal užsakymą — paruošimas trunka 1–2 savaites.",
    short: "Gaminama 1–2 sav.",
  };
}
