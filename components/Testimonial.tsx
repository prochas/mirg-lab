import Reveal from "./Reveal";

export default function Testimonial() {
  return (
    <section
      style={{
        background:
          "radial-gradient(46% 58% at 22% 28%, rgba(255,138,61,0.10), transparent 72%), radial-gradient(48% 62% at 82% 80%, rgba(255,78,0,0.07), transparent 74%), #fafaf7",
      }}
    >
      <Reveal className="mx-auto max-w-[760px] px-8 py-[110px] text-center">
        <div className="mb-2 text-[56px] font-semibold leading-none text-orange">
          &ldquo;
        </div>
        <p className="m-0 mb-7 font-serif text-[clamp(24px,3.4vw,34px)] italic leading-[1.38] tracking-[-0.005em] text-ink">
          It&apos;s the only ring I never take off. The weight, the finish — it
          feels like it was made for me, because it basically was.
        </p>
        <div className="text-sm tracking-[0.02em] text-muted">
          Nora V. — <span className="text-ink">verified buyer</span>
        </div>
      </Reveal>
    </section>
  );
}
