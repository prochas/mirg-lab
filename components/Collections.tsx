import Link from "next/link";
import Reveal from "./Reveal";
import { categories } from "@/lib/data";

export default function Collections() {
  return (
    <section
      id="collections"
      className="mx-auto max-w-[1200px] px-8 py-[104px]"
    >
      <Reveal className="mb-12 text-center">
        <div className="mb-3.5 text-xs font-medium uppercase tracking-[0.22em] text-orange">
          Collections
        </div>
        <h2 className="m-0 font-serif text-[clamp(30px,4.4vw,42px)] font-medium leading-[1.05] tracking-[-0.01em]">
          Find your edit
        </h2>
      </Reveal>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {categories.map((c) => (
          <Reveal key={c.name}>
            <Link
              href="#rings"
              className="relative block aspect-[3/4] overflow-hidden rounded-xl border border-line bg-card no-underline transition-colors hover:border-orange"
            >
              {/* Replace with <Image> of the category. */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-placeholder">
                {c.img}
              </span>
              <div
                className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6"
                style={{
                  background:
                    "linear-gradient(to top, rgba(250,250,247,0.96), rgba(250,250,247,0))",
                }}
              >
                <div>
                  <div className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
                    {c.name}
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">{c.count}</div>
                </div>
                <span className="text-[18px] text-flame">→</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
