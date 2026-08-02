"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SizeChartModal from "./SizeChartModal";
import { useCartUI } from "./cart/CartUIProvider";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import { getFulfillment } from "@/lib/fulfillment";
import type { RingProduct } from "@/lib/rings";
import { useCartStore } from "@/store/cart";

export default function ProductPanel({ ring }: { ring: RingProduct }) {
  const t = useTranslations("product");
  const tFulfillment = useTranslations("fulfillment");
  const locale = useLocale() as Locale;
  const [chosenSize, setChosenSize] = useState<string | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const { openCart } = useCartUI();
  const add = useCartStore((s) => s.add);

  // Size is required, so this can't fire without one — the button is disabled
  // until then. The store keeps only the id; price comes from Sanity.
  function addToCart() {
    if (!chosenSize) return;
    add(ring.id, chosenSize);
    openCart();
  }

  const fulfillment = chosenSize
    ? getFulfillment(ring, chosenSize, tFulfillment)
    : null;

  return (
    <>
      <div>
        {/* Size header + chart trigger */}
        <div className="mb-2.5 flex items-baseline justify-between gap-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
            {t("size")}
          </div>
          <button
            type="button"
            onClick={() => setChartOpen(true)}
            className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] underline-offset-4 transition-colors duration-300 hover:text-[#ff4d3d] hover:underline"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="10" rx="2" />
              <path d="M6 7v3M10 7v5M14 7v3M18 7v5" />
            </svg>
            {t("sizeGuide")}
          </button>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-2">
          {ring.sizeOptions.map((s) => {
            const active = chosenSize === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setChosenSize(s)}
                aria-pressed={active}
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-semibold transition-colors duration-300 ${
                  active
                    ? "border-[#ff4d3d] bg-[#ff4d3d] text-white"
                    : "border-[#111]/20 text-[#111] hover:border-[#111]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Fulfillment message — the shared getFulfillment() result */}
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-[12px] px-4 py-3 text-[14px] leading-[1.45] ${
            fulfillment?.status === "ready_exact"
              ? "bg-[#111]/[0.04] text-[#111]"
              : "bg-[#111]/[0.04] text-[#3a3a38]"
          }`}
        >
          <span
            className={`mt-[6px] h-[7px] w-[7px] flex-none rounded-full ${
              fulfillment?.status === "ready_exact"
                ? "bg-[#2f9e44]"
                : fulfillment
                  ? "bg-[#ff4d3d]"
                  : "bg-[#7a7a76]"
            }`}
          />
          {fulfillment ? fulfillment.message : t("choosePrompt")}
        </div>

        <button
          type="button"
          onClick={addToCart}
          disabled={!chosenSize}
          className="group mt-5 flex w-full items-center justify-center gap-3 rounded-[10px] bg-[#111] py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,box-shadow,opacity] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] enabled:hover:bg-[#ff4d3d] enabled:hover:shadow-[0_4px_24px_rgba(255,77,61,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {chosenSize ? (
            <>
              {t("addToCart", { price: formatPrice(ring.price, locale) })}
              <span className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1.5">
                →
              </span>
            </>
          ) : (
            t("chooseSize")
          )}
        </button>

        <a
          href="mailto:uzsakymai@mirga.lab"
          className="mt-3 block text-center text-[13px] text-[#7a7a76] no-underline transition-colors duration-300 hover:text-[#111]"
        >
          {t("customNote")}
        </a>
      </div>

      <SizeChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        highlightSize={chosenSize}
      />
    </>
  );
}
