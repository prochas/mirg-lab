import Reveal from "./Reveal";

export default function BrandStory() {
  return (
    <section
      id="about"
      style={{
        background:
          "radial-gradient(48% 60% at 18% 30%, rgba(255,138,61,0.10), transparent 72%), radial-gradient(50% 64% at 88% 78%, rgba(255,78,0,0.07), transparent 74%), #fafaf7",
      }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-16 px-8 py-[104px]">
        <Reveal className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-xl border border-line bg-card">
          {/* Replace with <Image> of the atelier bench. */}
          <span className="font-mono text-xs text-placeholder">
            atelier_bench.jpg
          </span>
        </Reveal>

        <Reveal className="max-w-[460px]">
          <div className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Our craft
          </div>
          <h2 className="m-0 mb-[22px] font-serif text-[clamp(28px,3.8vw,40px)] font-medium leading-[1.08] tracking-[-0.01em]">
            Made by hand,
            <br />
            <em className="italic">built to last.</em>
          </h2>
          <p className="m-0 mb-4 text-[17px] leading-[1.65] text-muted">
            Every mirga.lab ring begins as a sketch and ends at our bench, shaped
            by hand from recycled gold and conflict-free stones. We make small
            batches, slowly — no seasons, no noise.
          </p>
          <p className="m-0 text-[17px] leading-[1.65] text-muted">
            The result is fine jewellery that feels contemporary and quietly
            personal, designed to live on your hand for decades.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
