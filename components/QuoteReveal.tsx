"use client";

import { useEffect, useRef } from "react";

export default function QuoteReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  // tokens includes '\n' for line breaks; chars is only printable characters
  const tokens = Array.from(text);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let elementTop = -1;

    const onScroll = (e: Event) => {
      const scroll = (e as CustomEvent<number>).detail;
      const vh = window.innerHeight;

      if (elementTop < 0) {
        elementTop = scroll + el.getBoundingClientRect().top;
      }

      // progress 0→1: starts when element enters viewport, ends after 0.7×vh more scroll
      const progress = Math.max(
        0,
        Math.min(1, (scroll - (elementTop - vh)) / (vh * 0.7)),
      );

      const n = charsRef.current.length;
      charsRef.current.forEach((span, i) => {
        if (!span) return;
        // Left-to-right stagger: first char at progress=0, last at progress=0.65
        const p = Math.max(0, Math.min(1, (progress - (i / n) * 0.65) / 0.35));
        span.style.opacity = String(p);
        span.style.transform = `translateX(${(1 - p) * -0.7}em)`;
      });
    };

    window.addEventListener("smooth-scroll", onScroll);
    return () => window.removeEventListener("smooth-scroll", onScroll);
  }, []);

  let charIdx = 0;
  return (
    <p ref={containerRef} className={className}>
      {tokens.map((token, i) => {
        if (token === "\n") return <br key={i} />;
        const idx = charIdx++;
        return (
          <span
            key={i}
            ref={(el) => {
              charsRef.current[idx] = el;
            }}
            className="inline-block"
            style={{ opacity: 0, transform: "translateX(-0.7em)" }}
          >
            {token === " " ? " " : token}
          </span>
        );
      })}
    </p>
  );
}
