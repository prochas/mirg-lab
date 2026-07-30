"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clamp, useScrollEffect } from "@/lib/scroll";
import { getSteps } from "@/lib/about";
import type { Locale } from "@/i18n/routing";

// Vertical scroll drives horizontal movement: the section is tall, the inner
// panel is pinned, and the track slides sideways across it.
export default function ProcessTrack() {
  const t = useTranslations("about.process");
  const steps = getSteps(useLocale() as Locale);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  // Cached so the scroll handler never reads layout.
  const distanceRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      distanceRef.current = Math.max(0, track.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  useScrollEffect(sectionRef, ({ scroll, vh, top, height }) => {
    // The pinned panel is one viewport tall, so travel = height - vh.
    const p = clamp((scroll - top) / Math.max(1, height - vh));

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-p * distanceRef.current}px, 0, 0)`;
    }
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${p})`;
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#111] text-white"
      // Tall enough to give each step roughly half a viewport of scroll.
      style={{ height: `${100 + steps.length * 55}vh` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        {/* Heading */}
        <div className="px-[clamp(18px,4vw,56px)]">
          <div className="mb-[clamp(16px,1.6vw,22px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
            {t("eyebrow")}
          </div>
          <h2 className="m-0 mb-[clamp(28px,4vw,52px)] font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.9rem,5vw,3.8rem)]">
            {t("heading")}
          </h2>
        </div>

        {/* Sliding track */}
        <div
          ref={trackRef}
          className="flex gap-[clamp(16px,2vw,28px)] px-[clamp(18px,4vw,56px)] will-change-transform"
          style={{ width: "max-content" }}
        >
          {steps.map((s) => (
            <article
              key={s.no}
              className="group w-[clamp(260px,32vw,420px)] flex-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#222]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-100"
                />
                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#ff4d3d] font-[family-name:var(--font-anton)] text-[15px] leading-none text-white">
                  {s.no}
                </div>
              </div>

              <h3 className="mt-5 font-[family-name:var(--font-anton)] font-normal uppercase leading-none text-[clamp(1.3rem,2.4vw,1.9rem)]">
                {s.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[14px] font-light leading-[1.6] text-white/60">
                {s.body}
              </p>
            </article>
          ))}
        </div>

        {/* Horizontal progress bar */}
        <div className="mx-[clamp(18px,4vw,56px)] mt-[clamp(28px,4vw,48px)] h-[2px] bg-white/15">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-[#ff4d3d] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
