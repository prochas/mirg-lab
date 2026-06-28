// Floating nav "pill" — server component, no JS.
// Hover states are pure CSS.

const links = [
  { label: "Shop", href: "#categories" },
  { label: "Rings", href: "#categories" },
  { label: "Pendants", href: "#featured" },
  { label: "Story", href: "#story" },
];

export default function Navbar() {
  return (
    <header
      className="fixed top-[18px] left-1/2 -translate-x-1/2 z-[1000]
                 w-[calc(100%-32px)] max-w-[1320px]
                 flex items-center justify-between gap-5
                 rounded-2xl border border-white/30 pl-5 pr-3.5 py-[11px]
                 bg-[linear-gradient(135deg,#FFA64D_0%,#FF6B2C_52%,#F0480D_100%)]"
    >
      {/* Logo */}
      <a
        href="#top"
        className="font-[family-name:var(--font-anton)] text-[22px] tracking-[0.01em] leading-none text-white no-underline"
      >
        mirga<span className="font-[family-name:var(--font-epilogue)] font-light">.lab</span>
      </a>

      {/* Navigation links */}
      <nav aria-label="Pagrindinis meniu" className="flex items-center gap-[clamp(14px,2vw,26px)] max-md:hidden">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[12.5px] font-semibold uppercase tracking-[0.09em]
                       text-white no-underline transition-colors duration-300 hover:text-[#111]"
          >
            {l.label}
          </a>
        ))}
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

        {/* Cart */}
        <button
          aria-label="Cart"
          className="group relative flex h-10 w-10 items-center justify-center rounded-[11px]
                     text-white transition-colors duration-300 hover:bg-white/90 hover:text-[#111]"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_0_2px_rgba(240,72,13,0.6)]" />
        </button>
      </div>
    </header>
  );
}
