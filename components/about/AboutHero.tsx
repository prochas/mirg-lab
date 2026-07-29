"use client";

import { useRef } from "react";
import { clamp, useScrollEffect } from "@/lib/scroll";

// Layered parallax: the photo drifts down and zooms while the headline lifts
// away faster, so the two separate as you scroll into the story.
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useScrollEffect(sectionRef, ({ scroll, top, height }) => {
    const p = clamp((scroll - top) / height);

    if (bgRef.current) {
      bgRef.current.style.transform = `translate3d(0, ${p * 16}%, 0) scale(${
        1 + p * 0.14
      })`;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(0, ${p * -90}px, 0)`;
      contentRef.current.style.opacity = String(clamp(1 - p * 1.6));
    }
    if (veilRef.current) {
      veilRef.current.style.opacity = String(0.58 + p * 0.32);
    }
    if (hintRef.current) {
      hintRef.current.style.opacity = String(clamp(1 - p * 4));
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#111] px-[clamp(18px,4vw,56px)]"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-hero/seven.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </div>

      {/* Scrim — the photography is busy, so light text needs it to stay legible */}
      <div
        ref={veilRef}
        className="absolute inset-0 bg-[#111]"
        style={{ opacity: 0.58 }}
      />

      <div
        ref={contentRef}
        className="relative z-[2] flex flex-col items-center text-center will-change-transform"
      >
        <div className="mb-[clamp(20px,3vw,34px)] flex items-center gap-3.5">
          <span className="h-[9px] w-[9px] rounded-full bg-[#ff4d3d]" />
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/80">
            01 / Apie mus
          </span>
        </div>

        <h1 className="m-0 flex flex-col gap-[0.06em] font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.85] tracking-[-0.005em] text-white text-[clamp(2.8rem,12vw,10rem)]">
          <span className="block">Kalta</span>
          <span className="block">Ranka</span>
          <span className="block text-[#ff4d3d]">Nuo 2021</span>
        </h1>

        <p className="mt-[clamp(24px,4vw,40px)] max-w-[46ch] text-[clamp(0.95rem,1.4vw,1.15rem)] font-light leading-[1.6] text-white/70">
          Maža dirbtuvė Vilniuje, kurioje žiedai gimsta po vieną — ne partijomis,
          ne konvejeriu, ne skubant.
        </p>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-[clamp(24px,4vw,44px)] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2.5"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
          Slinkite
        </span>
        <span className="h-[46px] w-[1px] bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
