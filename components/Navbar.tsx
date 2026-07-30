// Floating nav "pill" — server component, no JS.
// Hover states are pure CSS.

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JEWELRY_CATEGORIES, NAV_LINKS } from "@/lib/nav";
import CartButton from "./cart/CartButton";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <header
      className="fixed top-[18px] left-1/2 -translate-x-1/2 z-[1000]
                 w-[calc(100%-32px)] max-w-[1320px]
                 flex items-center justify-between gap-5
                 rounded-2xl border border-white/20 pl-5 pr-3.5 py-[11px]
                 bg-black/30 backdrop-blur-xl"
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-[family-name:var(--font-anton)] text-[22px] tracking-[0.01em] leading-none text-white no-underline"
      >
        mirga<span className="font-[family-name:var(--font-epilogue)] font-light">.lab</span>
      </Link>

      {/* Navigation links */}
      {/* Products first, then the info pages, support last — the conventional
          e-commerce order, since browsing the catalog is the primary action and
          Contact is the last resort. */}
      <nav aria-label={t("menuLabel")} className="flex items-center gap-[clamp(14px,2vw,26px)] max-md:hidden">
        {/* Jewelry dropdown — pure CSS hover, no JS */}
        <div className="group relative py-2">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.09em]
                       text-white/80 transition-colors duration-300 group-hover:text-white"
          >
            {t("jewelry")}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* `pt-2.5` is a transparent bridge, not decoration: it keeps the
              pointer inside .group while travelling from the trigger down to
              the panel. Offsetting the panel with a margin/translate instead
              leaves a dead band there, and the menu flickers on the way down. */}
          <div
            className="invisible absolute left-1/2 top-full z-[1000] w-[220px] -translate-x-1/2 pt-2.5 opacity-0
                       transition-[opacity,visibility] duration-200 ease-out
                       group-hover:visible group-hover:opacity-100"
          >
            {/* Opaque, not frosted, on purpose: this panel sits inside <header>,
                which has its own backdrop-blur. An ancestor with backdrop-filter
                becomes a backdrop root, so a nested backdrop-filter has nothing
                to sample and renders inert — any transparency here just leaks the
                hero text through. Solid background + shadow instead. */}
            <div
              className="translate-y-1.5 rounded-2xl border border-white/15 bg-[#0c0c0c] p-2
                         shadow-[0_14px_36px_rgba(0,0,0,0.18)]
                         transition-transform duration-200 ease-out group-hover:translate-y-0"
            >
              {JEWELRY_CATEGORIES.map((c) =>
                c.soon ? (
                  <span
                    key={c.key}
                    className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white/40"
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
                    className="block rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white no-underline transition-colors duration-200 hover:bg-white/10"
                  >
                    {t(`categories.${c.key}`)}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        {NAV_LINKS.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            className="text-[12.5px] font-semibold uppercase tracking-[0.09em]
                       text-white/80 no-underline transition-colors duration-300 hover:text-white"
          >
            {t(l.key)}
          </Link>
        ))}
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-1.5">
        {/* Search — desktop only. Below md the burger at the far right carries
            the nav links that the hidden <nav> would otherwise strand. */}
        <button
          aria-label={t("search")}
          className="group hidden h-10 w-10 items-center justify-center rounded-[11px]
                     text-white transition-colors duration-300 hover:bg-white/90 hover:text-[#111] md:flex"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        {/* Language — kept next to the cart so both live in the same icon row */}
        <LanguageSwitcher />
        <span aria-hidden className="h-5 w-px bg-white/20" />

        {/* Cart — client component so <Navbar> itself stays server-rendered */}
        <CartButton />

        {/* Burger + dropdown panel — mobile only, and deliberately last: as the
            outermost control it's the easiest one-handed target, it keeps the
            language/cart utility pair intact rather than splitting it, and a menu
            at the row's edge is where people look for one. */}
        <span aria-hidden className="h-5 w-px bg-white/20 md:hidden" />
        <MobileMenu />
      </div>
    </header>
  );
}
