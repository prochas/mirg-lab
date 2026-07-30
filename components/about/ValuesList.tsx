"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clamp, useScrollEffect } from "@/lib/scroll";
import { getValues } from "@/lib/about";
import type { Locale } from "@/i18n/routing";

// Each row's rule draws itself in as the row crosses the lower half of the
// viewport, so the list assembles under you as you scroll.
export default function ValuesList() {
  const t = useTranslations("about.values");
  const values = getValues(useLocale() as Locale);
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollEffect(sectionRef, ({ scroll, vh, top, height }) => {
    const rowHeight = height / values.length;

    values.forEach((_, i) => {
      const rowTop = top + rowHeight * i;
      // 0 as the row reaches the viewport bottom, 1 once it's a third up.
      const p = clamp((scroll + vh - rowTop) / (vh * 0.66));

      const rule = ruleRefs.current[i];
      if (rule) rule.style.transform = `scaleX(${p})`;

      const row = rowRefs.current[i];
      if (row) {
        row.style.opacity = String(0.25 + p * 0.75);
        row.style.transform = `translate3d(0, ${(1 - p) * 22}px, 0)`;
      }
    });
  });

  return (
    <section
      ref={sectionRef}
      className="px-[clamp(18px,4vw,56px)] py-[clamp(48px,8vw,110px)]"
    >
      <div className="mb-[clamp(28px,4vw,52px)]">
        <div className="mb-[clamp(16px,1.6vw,22px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
          {t("eyebrow")}
        </div>
        <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.9rem,5vw,3.8rem)] text-[#111]">
          {t("heading")}
        </h2>
      </div>

      <div className="flex flex-col">
        {values.map((v, i) => (
          <div key={v.no}>
            {/* Self-drawing rule */}
            <div className="h-[1px] w-full bg-[#111]/10">
              <div
                ref={(el) => {
                  ruleRefs.current[i] = el;
                }}
                className="h-full w-full origin-left bg-[#111] will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            <div
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="grid grid-cols-1 gap-3 py-[clamp(26px,3.5vw,44px)] will-change-[opacity,transform] md:grid-cols-[auto_1fr_1.2fr] md:gap-[clamp(24px,4vw,64px)]"
              style={{ opacity: 0.25 }}
            >
              <div className="font-[family-name:var(--font-anton)] leading-none text-[clamp(1.4rem,2.4vw,2rem)] text-[#ff4d3d]">
                {v.no}
              </div>
              <h3 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[1.05] tracking-[-0.01em] text-[clamp(1.4rem,3vw,2.2rem)] text-[#111]">
                {v.title}
              </h3>
              <p className="m-0 max-w-[46ch] text-[clamp(0.95rem,1.3vw,1.05rem)] font-light leading-[1.65] text-[#3a3a38]">
                {v.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
