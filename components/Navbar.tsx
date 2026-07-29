// Floating nav "pill" — server component, no JS.
// Hover states are pure CSS.

import Link from "next/link";
import CartButton from "./cart/CartButton";

// Absolute hrefs so these still resolve from /products/* pages.
const links = [
  { label: "Shop", href: "/#categories" },
  { label: "New In", href: "/#featured" },
  { label: "Story", href: "/about" },
];

const jewelryCategories = [
  { label: "Žiedai", href: "/products/rings", soon: false },
  { label: "Grandinėlės", href: "#", soon: true },
  { label: "Apyrankės", href: "#", soon: true },
  { label: "Auskarai", href: "#", soon: true },
];

export default function Navbar() {
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
      <nav aria-label="Pagrindinis meniu" className="flex items-center gap-[clamp(14px,2vw,26px)] max-md:hidden">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-[12.5px] font-semibold uppercase tracking-[0.09em]
                       text-white/80 no-underline transition-colors duration-300 hover:text-white"
          >
            {l.label}
          </Link>
        ))}

        {/* Jewelry dropdown — pure CSS hover, no JS */}
        <div className="group relative py-2">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.09em]
                       text-white/80 transition-colors duration-300 group-hover:text-white"
          >
            Papuošalai
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
              {jewelryCategories.map((c) =>
                c.soon ? (
                  <span
                    key={c.label}
                    className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white/40"
                  >
                    {c.label}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
                      Netrukus
                    </span>
                  </span>
                ) : (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="block rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white no-underline transition-colors duration-200 hover:bg-white/10"
                  >
                    {c.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          aria-label="Search"
          className="group flex h-10 w-10 items-center justify-center rounded-[11px]
                     text-white transition-colors duration-300 hover:bg-white/90 hover:text-[#111]"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        {/* Cart — client component so <Navbar> itself stays server-rendered */}
        <CartButton />
      </div>
    </header>
  );
}
