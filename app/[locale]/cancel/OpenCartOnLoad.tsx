"use client";

import { useCartUI } from "@/components/cart/CartUIProvider";

/**
 * "Back to the cart" — the cart is a drawer, not a page, so this reopens it
 * rather than navigating anywhere.
 */
export default function OpenCartOnLoad({ label }: { label: string }) {
  const { openCart } = useCartUI();

  return (
    <button
      type="button"
      onClick={openCart}
      className="rounded-full bg-[#111] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#ff4d3d]"
    >
      {label}
    </button>
  );
}
