"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background video on the right of the hero. Decorative only — kept out
 * of the LCP path: it sits behind the legibility mask and uses
 * `preload="metadata"` so it doesn't compete with the hero text for bandwidth.
 * The effect is a safety net that forces muted autoplay where browsers block it.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const start = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    };

    start();
    const t = window.setTimeout(start, 400);
    const kick = () => start();
    window.addEventListener("pointerdown", kick, { once: true });

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", kick);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      src="/assets/hero-loop.mp4"
      aria-hidden="true"
      className="hero-video pointer-events-none absolute right-0 top-0 z-[1] h-full w-[54%] object-cover opacity-[0.62]"
    />
  );
}
