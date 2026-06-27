import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Rings", href: "#rings" },
      { label: "Collections", href: "#collections" },
      { label: "Gift cards", href: "#rings" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "About", href: "#about" },
      { label: "Materials", href: "#about" },
      { label: "Care & repair", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "#contact" },
      { label: "Contact", href: "#contact" },
      { label: "Stockists", href: "#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-12 px-8 pb-10 pt-16">
        <div className="max-w-[280px]">
          <div className="mb-3.5 text-[21px] font-semibold tracking-[-0.03em]">
            mirga<span className="text-orange">.</span>lab
          </div>
          <p className="m-0 text-sm leading-[1.6] text-muted">
            Modern fine jewellery, handmade in small batches. Designed to be worn
            every day.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              {col.title}
            </div>
            <div className="flex flex-col gap-[11px]">
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm text-muted no-underline transition-colors hover:text-flame"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-8 py-[22px]">
          <span className="text-[13px] text-faint">
            © 2026 mirga.lab. All rights reserved.
          </span>
          <span className="text-[13px] text-faint">Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
