"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Drawer open/close only. The cart itself lives in `store/cart.ts` (Zustand,
// persisted to localStorage) — this is purely the "is the panel showing" flag,
// so the navbar icon and the product page's "Į krepšelį" button can both reveal
// the same drawer. Kept separate because open/close is ephemeral UI state that
// must never be persisted.
type CartUI = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartUIContext = createContext<CartUI | null>(null);

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used inside <CartUIProvider>");
  return ctx;
}

export default function CartUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openCart, closeCart }),
    [open, openCart, closeCart],
  );

  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  );
}
