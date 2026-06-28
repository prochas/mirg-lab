// Horizontal category slider.
// On hover: image scales up + tilts -2deg, an accent-tinted overlay
// fades in, and a "+" badge pops in — all via Tailwind `group-hover`.
// The track scrolls natively (swipe / trackpad / scroll), so it needs
// no JS arrow buttons.

type Cat = {
  title: string;
  meta: string;
  img: string; // replace with your own image in /public
  badge?: string;
};

const categories: Cat[] = [
  { title: "Rings", meta: "24 pieces", img: "/categories/rings.jpg" },
  { title: "Signets", meta: "12 pieces", img: "/categories/signets.jpg" },
  {
    title: "Pendants",
    meta: "Just dropped",
    img: "/categories/pendants.jpg",
    badge: "New",
  },
  { title: "Stacks", meta: "18 pieces", img: "/categories/stacks.jpg" },
];

export default function Categories() {
  return (
    <section id="categories" className="py-[clamp(40px,6vw,84px)]">
      {/* Heading */}
      <div className="mb-[clamp(24px,3vw,40px)] px-[clamp(18px,4vw,56px)]">
        <div className="mb-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
          01 / SHOP
        </div>
        <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
          By Category
        </h2>
      </div>

      {/* Scrollable track */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(14px,2vw,24px)] overflow-x-auto px-[clamp(18px,4vw,56px)] py-1.5">
        {categories.map((c) => (
          <a
            key={c.title}
            href="#featured"
            className="group w-[clamp(230px,27vw,310px)] flex-none snap-start no-underline"
          >
            <div className="relative aspect-[5/6] overflow-hidden rounded-[22px] bg-[#e9e7df]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2"
              />
              {/* accent overlay */}
              <div className="absolute inset-0 bg-[#ff4d3d]/25 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100" />
              {/* + badge */}
              <div className="absolute right-3.5 top-3.5 flex h-[46px] w-[46px] scale-[0.4] items-center justify-center rounded-full bg-white pb-1 font-[family-name:var(--font-anton)] text-[30px] leading-none opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
                +
              </div>
              {c.badge && (
                <div className="absolute left-3.5 top-3.5 rounded-lg bg-[#ff4d3d] px-[11px] py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                  {c.badge}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-2.5">
              <div className="font-[family-name:var(--font-anton)] uppercase leading-none text-[clamp(1.3rem,2.4vw,1.7rem)] text-[#111]">
                {c.title}
              </div>
              <div className="text-[13px] text-[#7a7a76]">{c.meta}</div>
            </div>
          </a>
        ))}

        {/* Made-to-order dark card */}
        <a
          href="#story"
          className="group w-[clamp(230px,27vw,310px)] flex-none snap-start no-underline"
        >
          <div className="relative flex aspect-[5/6] items-end overflow-hidden rounded-[22px] bg-[#111] p-6 text-white">
            <div className="absolute inset-0 bg-[#ff4d3d]/25 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100" />
            <div className="absolute right-3.5 top-3.5 flex h-[46px] w-[46px] scale-[0.4] items-center justify-center rounded-full bg-white pb-1 font-[family-name:var(--font-anton)] text-[30px] leading-none text-[#111] opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
              +
            </div>
            <div className="relative z-[2]">
              <div className="font-[family-name:var(--font-anton)] uppercase leading-[0.95] text-[clamp(1.6rem,3vw,2.2rem)]">
                Made
                <br />
                To Order
              </div>
              <div className="mt-2.5 text-[13px] text-[#bdbdb8]">
                Build your own piece →
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
