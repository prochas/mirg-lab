"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartKey, MAX_QTY, type CartLine } from "@/lib/cart";

/**
 * The cart. Holds `{ id, size, qty }` and nothing else — never a price, never a
 * title. Everything displayable is resolved from Sanity on the server, so a
 * tampered localStorage can only ever produce a wrong *quantity*, which the
 * checkout route re-prices from Sanity anyway.
 *
 * `id` is the Sanity document id, which is also what the checkout read
 * (`productsByIdsQuery`) looks up. Size is part of the key, so the same ring in
 * two sizes is two independent lines.
 */
type CartState = {
  lines: CartLine[];
  /** Adds one, or bumps the quantity if this id+size is already in the cart. */
  add: (id: string, size: string, qty?: number) => void;
  remove: (key: string) => void;
  /** Clamped to 1..MAX_QTY; dropping to 0 removes the line. */
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  /** Drops lines whose product no longer resolves (unpublished or deleted). */
  keepOnly: (keys: string[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      add: (id, size, qty = 1) =>
        set((state) => {
          const key = cartKey({ id, size });
          const existing = state.lines.find((l) => cartKey(l) === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                cartKey(l) === key
                  ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) }
                  : l,
              ),
            };
          }
          return {
            lines: [...state.lines, { id, size, qty: Math.min(qty, MAX_QTY) }],
          };
        }),

      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => cartKey(l) !== key) })),

      setQty: (key, qty) =>
        set((state) => ({
          lines: state.lines.flatMap((l) => {
            if (cartKey(l) !== key) return [l];
            if (qty < 1) return [];
            return [{ ...l, qty: Math.min(qty, MAX_QTY) }];
          }),
        })),

      clear: () => set({ lines: [] }),

      keepOnly: (keys) =>
        set((state) => {
          const keep = new Set(keys);
          const lines = state.lines.filter((l) => keep.has(cartKey(l)));
          // Only produce a new array when something actually changed, or this
          // would re-render the drawer on every resolve.
          return lines.length === state.lines.length ? state : { lines };
        }),
    }),
    {
      name: "mirga-cart",
      version: 1,
      // `createJSONStorage` swallows the missing-localStorage case, so this is
      // safe during SSR of the client bundle.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

/**
 * True once the persisted cart has been read back from localStorage.
 *
 * Needed because the server renders an empty cart while the browser rehydrates
 * a full one — reading `lines` directly on the first client render would differ
 * from the SSR'd HTML and trip a hydration mismatch. Gate any cart-dependent
 * output on this and render the empty state until it flips.
 *
 * `useSyncExternalStore` rather than a mount effect: the third argument is the
 * server snapshot, so React uses `false` for the SSR and hydration render and
 * only then switches to the real value. That's the same two-pass behaviour a
 * `useState`+`useEffect` flag gives, minus the setState-in-effect.
 */
export function useCartHydrated() {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

/** Total item count — the navbar badge. */
export function useCartCount() {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartHydrated();
  return hydrated ? lines.reduce((sum, l) => sum + l.qty, 0) : 0;
}
