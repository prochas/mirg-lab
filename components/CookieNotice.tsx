"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "mirga-cookie-notice-dismissed";

function subscribe() {
  return () => {};
}

function isDismissed() {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

/**
 * Not a consent gate — there is nothing to gate. The cart's localStorage is
 * strictly necessary (ePrivacy Art. 5(3) exemption) and Vercel Web Analytics
 * is cookieless and collects no personal data, so neither needs opt-in. This
 * is a transparency notice, dismissed once and remembered locally.
 *
 * `useSyncExternalStore` rather than a mount effect + setState, for the same
 * reason `useCartHydrated` in `store/cart.ts` does: the server snapshot
 * (`true` = dismissed) matches the SSR/hydration render, so nothing flashes
 * in, and React swaps in the real localStorage value right after — no
 * hydration mismatch, no setState-in-effect.
 */
export default function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const [closed, setClosed] = useState(false);

  if (dismissed || closed) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setClosed(true);
  }

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-[1100] flex flex-wrap items-center justify-center gap-4 border-t border-[#111]/10 bg-white/95 px-[clamp(18px,4vw,32px)] py-4 backdrop-blur-md sm:justify-between"
    >
      <p className="m-0 max-w-[64ch] text-[13px] leading-[1.5] text-[#3a3a38]">
        {t("text")}{" "}
        <Link
          href="/privacy"
          className="font-semibold text-[#111] underline underline-offset-2 hover:text-[#ff4d3d]"
        >
          {t("link")}
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="flex-none rounded-[10px] bg-[#111] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#ff4d3d]"
      >
        {t("accept")}
      </button>
    </div>
  );
}
