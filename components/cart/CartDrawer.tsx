"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useCartUI } from "./CartUIProvider";
import { lockScroll, unlockScroll } from "@/components/LenisProvider";
import { formatPrice } from "@/lib/format";
import {
  cartCount,
  cartSubtotal,
  mockCart,
  resolveCart,
  FREE_SHIPPING_FROM,
} from "@/lib/cart";

const payments = ["VISA", "MASTERCARD", "AMEX", "PAYPAL"];

// Every control below the open/close pair is intentionally inert — this is a
// UI pass only, so quantity steppers, remove and checkout do nothing yet.
export default function CartDrawer() {
  const t = useTranslations("cart");
  const tFulfillment = useTranslations("fulfillment");
  const locale = useLocale() as Locale;
  const { open, closeCart } = useCartUI();

  const items = resolveCart(mockCart, locale, tFulfillment);
  const subtotal = cartSubtotal(items);
  const count = cartCount(mockCart);
  const freeShipping = subtotal >= FREE_SHIPPING_FROM;

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, closeCart]);

  return (
    <>
      {/* Blurred scrim. This sits at body level — nesting it inside an element
          that already has backdrop-filter would make this one inert. */}
      <div
        onClick={closeCart}
        aria-hidden={!open}
        className={`fixed inset-0 z-[1500] bg-[#111]/40 backdrop-blur-xs transition-[opacity,visibility] duration-[400ms] ease-out ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogLabel")}
        /* The shadow is applied only while open. Parked off-screen it would
           still cast 60px of blur back across the viewport's right edge. */
        className={`fixed right-0 top-0 z-[1600] flex h-dvh w-full max-w-[92vw] flex-col bg-[#f7f6f2] transition-[transform,box-shadow] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[440px] ${
          open
            ? "translate-x-0 shadow-[-24px_0_60px_rgba(0,0,0,0.25)]"
            : "translate-x-full shadow-none"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex flex-none items-center justify-between gap-4 border-b border-[#111]/10 px-[clamp(18px,4vw,26px)] py-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="m-0 font-[family-name:var(--font-anton)] text-[1.5rem] font-normal uppercase leading-none tracking-[-0.01em] text-[#111]">
              {t("title")}
            </h2>
            <span className="text-[13px] font-semibold text-[#7a7a76]">
              ({count})
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label={t("close")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#111]/20 text-[#111] transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="font-[family-name:var(--font-anton)] text-[1.4rem] uppercase text-[#111]">
              {t("empty.title")}
            </div>
            <p className="mt-2.5 max-w-[30ch] text-[14px] font-light text-[#7a7a76]">
              {t("empty.body")}
            </p>
            <Link
              href="/products/rings"
              onClick={closeCart}
              className="mt-6 rounded-full bg-[#111] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors duration-300 hover:bg-[#ff4d3d]"
            >
              {t("empty.cta")}
            </Link>
          </div>
        ) : (
          <>
            {/* Shipping notice */}
            <div
              className={`flex-none px-[clamp(18px,4vw,26px)] py-3 text-[12px] font-semibold uppercase tracking-[0.08em] ${
                freeShipping
                  ? "bg-[#111] text-white"
                  : "bg-[#111]/[0.05] text-[#3a3a38]"
              }`}
            >
              {freeShipping
                ? t("shipping.free")
                : t("shipping.remaining", {
                    amount: formatPrice(FREE_SHIPPING_FROM - subtotal, locale),
                  })}
            </div>

            {/* ── Line items ── */}
            {/* data-lenis-prevent keeps this list natively scrollable */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-[clamp(18px,4vw,26px)]"
            >
              {items.map((item) => (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="flex gap-4 border-b border-[#111]/10 py-5 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative aspect-[5/6] w-[86px] flex-none overflow-hidden rounded-[14px] bg-[#e9e7df]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="block truncate font-[family-name:var(--font-anton)] text-[1.05rem] uppercase leading-none text-[#111] no-underline transition-colors duration-300 hover:text-[#ff4d3d]"
                        >
                          {item.product.title}
                        </Link>
                        <div className="mt-1.5 text-[12px] text-[#7a7a76]">
                          {item.product.material} ·{" "}
                          {t("sizeLabel", { size: item.size })}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        aria-label={t("remove", { title: item.product.title })}
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[#7a7a76] transition-colors duration-300 hover:bg-[#111]/[0.06] hover:text-[#ff4d3d]"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>

                    {/* Fulfillment — same getFulfillment() the product page uses */}
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-[6px] w-[6px] flex-none rounded-full ${
                          item.fulfillment.status === "ready_exact"
                            ? "bg-[#2f9e44]"
                            : "bg-[#ff4d3d]"
                        }`}
                      />
                      <span className="text-[12px] text-[#3a3a38]">
                        {item.fulfillment.short}
                      </span>
                    </div>

                    {/* Quantity + line total */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-[#111]/20 p-1">
                        <button
                          type="button"
                          aria-label={t("decrease")}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] leading-none text-[#111] transition-colors duration-200 hover:bg-[#111] hover:text-white"
                        >
                          −
                        </button>
                        <span className="min-w-[22px] text-center text-[13px] font-semibold text-[#111]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={t("increase")}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] leading-none text-[#111] transition-colors duration-200 hover:bg-[#111] hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-[15px] font-semibold text-[#111]">
                        {formatPrice(item.lineTotal, locale)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="flex-none border-t border-[#111]/10 bg-[#f7f6f2] px-[clamp(18px,4vw,26px)] py-5">
              <div className="flex items-center justify-between text-[14px] text-[#3a3a38]">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[14px] text-[#3a3a38]">
                <span>{t("shippingLabel")}</span>
                <span>
                  {freeShipping ? t("shippingFree") : t("shippingCalculated")}
                </span>
              </div>

              <div className="mt-3.5 flex items-baseline justify-between border-t border-[#111]/10 pt-3.5">
                <span className="font-[family-name:var(--font-anton)] text-[1.15rem] uppercase leading-none text-[#111]">
                  {t("total")}
                </span>
                <span className="font-[family-name:var(--font-anton)] text-[1.5rem] leading-none text-[#111]">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>

              <p className="mt-1.5 text-right text-[11px] text-[#7a7a76]">
                {t("taxNote")}
              </p>

              <button
                type="button"
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-[10px] bg-[#111] py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#ff4d3d] hover:shadow-[0_4px_24px_rgba(255,77,61,0.35)]"
              >
                {t("checkout", { total: formatPrice(subtotal, locale) })}
                <span className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1.5">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="mt-2.5 w-full text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7a7a76] transition-colors duration-300 hover:text-[#111]"
              >
                {t("continue")}
              </button>

              {/* Trust row */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] text-[#7a7a76]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  {t("secure")}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                {payments.map((p) => (
                  <span
                    key={p}
                    className="rounded border border-[#111]/15 px-[7px] py-[3px] text-[9px] font-semibold tracking-[0.06em] text-[#7a7a76]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
