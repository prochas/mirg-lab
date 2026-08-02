"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/**
 * Empties the cart once an order is confirmed paid.
 *
 * Mounted only by `/success` after Stripe has verified the session, so a
 * cancelled or abandoned payment never costs the customer their cart. Renders
 * nothing.
 */
export default function ClearCart() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
