import KineticHeadline from "./KineticHeadline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-dvh flex flex-col bg-[#111]">
      {/* Background video — drop your src here, opacity controlled below */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      >
        <source
          src="/hero-bg.webm"
          type="video/webm"
        />
      </video>

      {/* Subtle overlay keeps text readable regardless of video brightness */}
      <div className="absolute inset-0 bg-[#111]/30" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-[clamp(18px,4vw,56px)] pt-[clamp(80px,10vw,120px)] pb-[clamp(48px,7vw,88px)]">
        {/* Eyebrow */}
        <div className="mb-[clamp(20px,3vw,34px)] flex items-center gap-3.5">
          <span className="h-[9px] w-[9px] rounded-full bg-white" />
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/80">
            Handmade · Small batch · Since 2021
          </span>
        </div>

        {/* Kinetic headline */}
        <KineticHeadline
          lines={["Forged", "By Hand", "Worn Loud"]}
          className="text-white text-center"
        />

        {/* CTA */}
        <div className="mt-[clamp(32px,5vw,56px)]">
          <a
            href="#categories"
            className="group inline-flex items-center gap-3 border-b-2 border-white/70 pb-[5px]
                         text-[clamp(1rem,1.4vw,1.25rem)] font-semibold text-white no-underline
                         transition-colors duration-[350ms] hover:border-[#ff4d3d] hover:text-[#ff4d3d]"
          >
            Shop the collection
            <span className="inline-block transition-transform duration-[350ms] group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
