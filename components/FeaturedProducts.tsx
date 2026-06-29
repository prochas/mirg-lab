
import ScrollReveal from "./ScrollReveal";

type Product = {
  title: string;
  price: string;
  front: string;
  hover: string;
};

const products: Product[] = [
  {
    title: "Žiedas Nr. 1",
    price: "180 €",
    front: "/new-offers/ring_one.avif",
    hover: "/new-offers/ring_one_hover.avif",
  },
  {
    title: "Žiedas Nr. 2",
    price: "145 €",
    front: "/new-offers/ring_two.avif",
    hover: "/new-offers/ring_two_hover.avif",
  },
  {
    title: "Žiedas Nr. 3",
    price: "210 €",
    front: "/new-offers/ring_three.avif",
    hover: "/new-offers/ring_three_hover.avif",
  },
  {
    title: "Žiedas Nr. 4",
    price: "260 €",
    front: "/new-offers/ring_four.avif",
    hover: "/new-offers/ring_four_hover.avif",
  },
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {products.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 80}>
            <a href="#" className="group block no-underline">
              <div className="relative aspect-[5/6] overflow-hidden rounded-[22px] bg-[#e9e7df]">
                {/* zoom wrapper — both images scale together */}
                <div className="absolute inset-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.front}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.hover}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                {/* + badge */}
                <div className="absolute right-3.5 top-3.5 flex h-[46px] w-[46px] scale-[0.4] items-center justify-center rounded-full bg-white pb-1 font-[family-name:var(--font-anton)] text-[30px] leading-none opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
                  +
                </div>
              </div>
              <div className="mt-[15px] flex items-baseline justify-between gap-2.5">
                <div className="font-[family-name:var(--font-anton)] uppercase tracking-[0.01em] text-[1.05rem] text-[#111]">
                  {p.title}
                </div>
                <div className="text-[15px] font-medium text-[#111]">
                  {p.price}
                </div>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
