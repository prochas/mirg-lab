"use client";

import { useCart } from "./CartProvider";

// Client leaf — the only interactive part of an otherwise static product card.
export default function AddToBagButton() {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={add}
      className="w-full cursor-pointer rounded-[9px] border border-line bg-white p-[11px] text-sm font-medium tracking-[-0.01em] text-ink transition-colors hover:border-orange hover:text-flame"
    >
      Add to bag
    </button>
  );
}
