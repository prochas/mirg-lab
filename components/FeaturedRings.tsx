import Link from "next/link";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { products } from "@/lib/data";

export default function FeaturedRings() {
  return (
    <section id="rings" className="mx-auto max-w-[1200px] px-8 py-[104px]">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3.5 text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Featured
          </div>
          <h2 className="m-0 font-serif text-[clamp(30px,4.4vw,42px)] font-medium leading-[1.05] tracking-[-0.01em]">
            Rings for now
          </h2>
        </div>
        <Link
          href="#collections"
          className="border-b border-line pb-[3px] text-[15px] text-muted no-underline transition-colors hover:border-orange hover:text-ink"
        >
          All rings →
        </Link>
      </Reveal>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(248px,1fr))] gap-7">
        {products.map((p) => (
          <Reveal key={p.name}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
