"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay (ms) before this element reveals once in view. */
  delay?: number;
};

/**
 * Scroll-in wrapper. SSR/no-JS renders fully visible (the `.reveal` resting
 * state). On mount it "arms" (hides) the element, then reveals it when it
 * scrolls into view via IntersectionObserver. A safety timeout reveals
 * anything still armed if IO never fires.
 */
export default function Reveal({ children, className = "", delay }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.remove("armed");
    };

    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh && r.bottom > 0;
    };

    el.classList.add("armed");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (inView()) reveal();
        else io.observe(el);
      }),
    );

    // Safety net: reveal if IO never fires.
    const sweep = window.setTimeout(() => {
      if (el.classList.contains("armed")) reveal();
    }, 1600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(sweep);
      io.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
