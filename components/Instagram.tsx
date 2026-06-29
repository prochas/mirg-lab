import ScrollReveal from "./ScrollReveal";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export default function Instagram() {
  return (
    <section
      id="instagram"
      className="mx-[clamp(12px,2vw,28px)] my-[clamp(20px,3vw,40px)]"
    >
      <ScrollReveal>
        <a
          href="https://www.instagram.com/mirga.lab"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[clamp(28px,4vw,48px)] bg-black px-[clamp(20px,5vw,80px)] py-[clamp(56px,9vw,120px)] text-white no-underline"
        >
          {/* Red glow that blooms on hover */}
          <div className="pointer-events-none absolute inset-0 bg-[#ff4d3d]/0 transition-colors duration-700 group-hover:bg-[#ff4d3d]/20" />

          {/* Label */}
          <div className="relative mb-[clamp(18px,3vw,32px)] text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
            04 / FOLLOW ALONG
          </div>

          {/* Handle */}
          <div className="relative flex items-center gap-[clamp(10px,1.5vw,18px)]">
            <InstagramIcon className="flex-shrink-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100 text-[clamp(1.4rem,3vw,2.4rem)] w-[clamp(22px,3vw,42px)] h-[clamp(22px,3vw,42px)]" />
            <span className="font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2rem,7vw,6rem)]">
              @mirga.lab
            </span>
          </div>

          {/* Sub-line */}
          <p className="relative mt-[clamp(16px,2.5vw,28px)] text-[15px] font-light text-white/50 transition-colors duration-500 group-hover:text-white/70">
            Sekite mus — kūriniai, procesas, naujienos.
          </p>

          {/* Follow pill */}
          <div className="relative mt-[clamp(24px,3.5vw,44px)] flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-[11px] text-[13px] font-semibold uppercase tracking-[0.1em] transition-all duration-[350ms] group-hover:border-white/60 group-hover:bg-white group-hover:text-[#111]">
            <InstagramIcon className="w-[15px] h-[15px]" />
            Sekti
          </div>
        </a>
      </ScrollReveal>
    </section>
  );
}
