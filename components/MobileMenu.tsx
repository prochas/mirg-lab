"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { JEWELRY_CATEGORIES, NAV_LINKS } from "@/lib/nav";

/**
 * Below `md` the desktop nav is hidden, so this replaces the search icon with a
 * burger that drops the same links down under the header pill.
 *
 * Renders a fragment — the button sits in the header's icon row while the panel
 * is absolutely positioned, so it resolves against <header> (the nearest
 * positioned ancestor) and spans the full width of the pill.
 */
export default function MobileMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Stores *where* the menu was opened rather than a bare boolean, so navigating
  // away closes it by derivation — including on browser back/forward. An effect
  // watching `pathname` to close it would do the same thing a render later, and
  // trips react-hooks/set-state-in-effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  const close = () => setOpenAt(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "block rounded-xl px-3.5 py-3 text-[13px] font-semibold uppercase tracking-[0.09em] text-white no-underline transition-colors duration-200 hover:bg-white/10";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="flex h-10 w-10 items-center justify-center rounded-[11px] text-white
                   transition-colors duration-300 hover:bg-white/90 hover:text-[#111] md:hidden"
      >
        {/* Three bars that fold into an X. Transitions name `translate` and
            `rotate`, not `transform` — Tailwind v4 writes those utilities to the
            standalone CSS properties, so transitioning `transform` animates
            nothing and the icon would snap. */}
        <span aria-hidden className="relative block h-[14px] w-[18px]">
          <span
            className={`absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current transition-[translate,rotate] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] block h-[2px] w-full rounded-full bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[12px] block h-[2px] w-full rounded-full bg-current transition-[translate,rotate] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Opaque, not frosted, on purpose: <header> already has backdrop-blur, and
          an ancestor with backdrop-filter becomes a backdrop root — a nested one
          has nothing to sample and renders inert, leaking the page through. */}
      <div
        ref={rootRef}
        id={panelId}
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full z-[1000] mt-2 rounded-2xl border border-white/15
                    bg-[#0c0c0c] p-2 shadow-[0_18px_44px_rgba(0,0,0,0.35)]
                    transition-[opacity,translate,visibility] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
      >
        {/* Same order as the desktop nav: products first, info pages after. */}
        <nav aria-label={t("menuLabel")} className="flex flex-col">
          {/* Jewellery categories, flattened — a nested collapsible would hide
              four items behind another tap for no benefit at this size. */}
          <div className="mb-1 border-b border-white/10 pb-2">
            <div className="px-3.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
              {t("jewelry")}
            </div>
            {JEWELRY_CATEGORIES.map((c) =>
              c.soon ? (
                <span
                  key={c.key}
                  className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-3 text-[13px] font-medium text-white/40"
                >
                  {t(`categories.${c.key}`)}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
                    {t("soon")}
                  </span>
                </span>
              ) : (
                <Link
                  key={c.key}
                  href={c.href}
                  onClick={close}
                  tabIndex={open ? undefined : -1}
                  className="block rounded-xl px-3.5 py-3 text-[13px] font-medium text-white no-underline transition-colors duration-200 hover:bg-white/10"
                >
                  {t(`categories.${c.key}`)}
                </Link>
              ),
            )}
          </div>

          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={close}
              tabIndex={open ? undefined : -1}
              className={itemClass}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
