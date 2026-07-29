"use client";

import { useRef } from "react";
import { clamp, useScrollEffect } from "@/lib/scroll";
import { chapters } from "@/lib/about";

// Scrollytelling: the image column is pinned while the text column scrolls.
// Scroll position picks the active chapter — the image cross-fades to match and
// the inactive chapters dim, so only the one you're reading is fully lit.
export default function StoryChapters() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  useScrollEffect(sectionRef, ({ scroll, vh, top, height }) => {
    // 0 when the section's top reaches mid-viewport, 1 at its bottom.
    const p = clamp((scroll + vh * 0.5 - top) / height);
    const active = clamp(Math.floor(p * chapters.length), 0, chapters.length - 1);

    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      const on = i === active;
      el.style.opacity = on ? "1" : "0";
      el.style.transform = `scale(${on ? 1 : 1.06})`;
    });

    textRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = i === active ? "1" : "0.32";
    });

    if (barRef.current) {
      barRef.current.style.transform = `scaleY(${p})`;
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative px-[clamp(18px,4vw,56px)] py-[clamp(48px,8vw,110px)]"
    >
      <div className="grid grid-cols-1 gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
        {/* Pinned image stack */}
        <div className="lg:sticky lg:top-[110px] lg:h-[calc(100dvh-160px)] lg:self-start">
          <div className="relative h-[52vh] overflow-hidden rounded-[22px] bg-[#e9e7df] lg:h-full">
            {chapters.map((c, i) => (
              <div
                key={c.no}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111]/80 to-transparent p-6 pt-16">
                  <div className="font-[family-name:var(--font-anton)] text-[clamp(1.4rem,2.6vw,2rem)] uppercase leading-none text-white">
                    {c.title}
                  </div>
                  <div className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">
                    {c.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-0 top-0 hidden h-full w-[2px] bg-[#111]/10 lg:block">
            <div
              ref={barRef}
              className="h-full w-full origin-top bg-[#ff4d3d] will-change-transform"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col lg:pl-[clamp(28px,4vw,56px)]">
            {chapters.map((c, i) => (
              <div
                key={c.no}
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="flex min-h-[68vh] flex-col justify-center py-[clamp(28px,4vw,48px)] transition-opacity duration-500"
                style={{ opacity: i === 0 ? 1 : 0.32 }}
              >
                <div className="mb-[clamp(16px,1.6vw,22px)] flex items-center gap-3.5">
                  <span className="font-[family-name:var(--font-anton)] text-[clamp(2.2rem,5vw,3.6rem)] leading-none text-[#ff4d3d]">
                    {c.no}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
                    {c.year}
                  </span>
                </div>

                <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.9rem,4.5vw,3.4rem)] text-[#111]">
                  {c.title}
                </h2>

                <p className="mt-4 max-w-[46ch] text-[clamp(0.95rem,1.3vw,1.1rem)] font-light leading-[1.65] text-[#3a3a38]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
