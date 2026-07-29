"use client";

import { useEffect, useRef } from "react";
import { stats } from "@/lib/about";

// Numbers count up once, when the row first enters view. Values are written
// straight to the DOM — 60fps of setState here would re-render for nothing.
export default function StatsRow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;

    const run = () => {
      const start = performance.now();
      const DURATION = 1400;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        // easeOutExpo — fast start, long settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        stats.forEach((s, i) => {
          const el = valueRefs.current[i];
          if (!el) return;
          el.textContent = `${Math.round(s.value * eased)}${s.suffix}`;
        });

        if (t < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-2 gap-x-6 gap-y-[clamp(28px,4vw,44px)] lg:grid-cols-4"
    >
      {stats.map((s, i) => (
        <div key={s.label}>
          <div className="font-[family-name:var(--font-anton)] leading-none text-[clamp(2.4rem,6vw,4.4rem)] text-[#111]">
            <span
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
            >
              0{s.suffix}
            </span>
          </div>
          <div className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
