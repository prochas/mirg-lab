import Link from "next/link";
import HeroVideo from "./HeroVideo";

// Server Component. The headline is the LCP element, so it ships in the initial
// HTML and is NOT wrapped in a scroll-reveal — it paints immediately with the
// preloaded font. Only the ambient video is a client island.
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[96vh] items-center overflow-hidden bg-cream"
    >
      {/* ambient drifting warm light */}
      <div
        aria-hidden="true"
        className="ambient pointer-events-none absolute inset-[-20%] z-0 opacity-[0.78]"
      />

      <HeroVideo />

      {/* left-side legibility fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 110% at 0% 50%, rgba(250,250,247,0.95) 0%, rgba(250,250,247,0.55) 48%, rgba(250,250,247,0) 88%)",
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[1200px] px-8 pb-[104px] pt-[140px]">
        <div className="max-w-[640px]">
          <div className="mb-[22px] text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Atelier — est. 2024
          </div>
          <h1 className="m-0 mb-6 font-serif text-[clamp(54px,9vw,104px)] font-medium leading-[0.95] tracking-[-0.015em] text-ink">
            Rings,
            <br />
            <em className="grad-text font-medium italic">
              reimagined.
            </em>
          </h1>
          <p className="m-0 mb-9 max-w-[430px] text-[19px] leading-[1.6] text-muted">
            Modern fine jewellery, designed in our atelier and made to be worn
            every single day.
          </p>
          <div className="flex flex-wrap items-center gap-7">
            <Link
              href="#rings"
              className="grad inline-flex items-center gap-2.5 rounded-[10px] px-[30px] py-[15px] text-base font-medium tracking-[-0.01em] text-white no-underline shadow-[0_8px_24px_rgba(255,78,0,0.24)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,78,0,0.32)]"
            >
              Shop rings
            </Link>
            <Link
              href="#collections"
              className="border-b border-line pb-[3px] text-base tracking-[-0.01em] text-ink no-underline transition-colors hover:border-orange"
            >
              View collections →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
