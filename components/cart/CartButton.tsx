"use client";

import { useTranslations } from "next-intl";
import { useCartUI } from "./CartUIProvider";
import { useCartCount } from "@/store/cart";

// Split out of Navbar so the header itself can stay a server component.
export default function CartButton() {
  const t = useTranslations("nav");
  const { openCart } = useCartUI();
  // Reads 0 until the persisted cart has rehydrated, matching the SSR'd HTML.
  const count = useCartCount();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={t("cart", { count })}
      className="group relative flex h-10 w-10 items-center justify-center rounded-[11px]
                 text-white transition-colors duration-300 hover:bg-white/90 hover:text-[#111]"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff4d3d] px-1 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      )}
    </button>
  );
}
