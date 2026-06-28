'use client'

import ScrollReveal from "./ScrollReveal";

type Product = {
  title: string;
  price: string;
  front: string;
  back: string;
  badge?: string;
};

const products: Product[] = [
  { title: "Signet No.1", price: "$180", front: "/products/signet-a.jpg", back: "/products/signet-b.jpg" },
  { title: "Twist Band", price: "$145", front: "/products/twist-a.jpg", back: "/products/twist-b.jpg" },
  { title: "Raw Pendant", price: "$210", front: "/products/raw-a.jpg", back: "/products/raw-b.jpg", badge: "New" },
  { title: "Stack Trio", price: "$260", front: "/products/stack-a.jpg", back: "/products/stack-b.jpg" },
];

export default function FeaturedProducts() {
  return (
    <section
      id="featured"
      className="px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]"
    >
      <ScrollReveal className="mb-[clamp(24px,3vw,44px)]">
        <div className="mb-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
          02 / NEW THIS WEEK
        </div>
        <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
          Fresh Off The Bench
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {products.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 80}>
            <a href="#" className="group block no-underline">
              <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#e9e7df]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.front}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.back}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {p.badge && (
                  <div className="absolute left-3.5 top-3.5 rounded-lg bg-[#ff4d3d] px-[11px] py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                    {p.badge}
                  </div>
                )}
              </div>
              <div className="mt-[15px] flex items-baseline justify-between gap-2.5">
                <div className="font-[family-name:var(--font-anton)] uppercase tracking-[0.01em] text-[1.05rem] text-[#111]">
                  {p.title}
                </div>
                <div className="text-[15px] font-medium text-[#111]">{p.price}</div>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
