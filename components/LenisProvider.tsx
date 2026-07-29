"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

// Module-level handle so overlays (e.g. the size chart) can freeze the page
// behind them — Lenis drives the scroll, so `overflow: hidden` alone won't do it.
let instance: Lenis | null = null;

export function lockScroll() {
  instance?.stop();
}

export function unlockScroll() {
  instance?.start();
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.08 });
      instance = lenis;

      lenis.on("scroll", ({ scroll }: { scroll: number }) => {
        window.dispatchEvent(
          new CustomEvent("smooth-scroll", { detail: scroll }),
        );
      });

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      instance = null;
    };
  }, []);

  return <>{children}</>;
}
