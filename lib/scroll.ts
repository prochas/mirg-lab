"use client";

import { useEffect, useRef, type RefObject } from "react";

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

/** Maps a value from one range to another, clamped to [0,1] of the source. */
export function progress(value: number, from: number, to: number) {
  if (to === from) return 0;
  return clamp((value - from) / (to - from));
}

type Metrics = {
  /** Current scroll position (document space). */
  scroll: number;
  /** Viewport height. */
  vh: number;
  /** Element's top edge in document space. */
  top: number;
  /** Element's height. */
  height: number;
};

/**
 * Drives an animation from Lenis's `smooth-scroll` event.
 *
 * Position/size are measured once (and on resize) rather than per frame, so the
 * handler never forces a layout — it only writes styles. Follow that rule in the
 * handler too: write to `.style`, don't read geometry.
 */
export function useScrollEffect(
  ref: RefObject<HTMLElement | null>,
  handler: (m: Metrics) => void,
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let top = 0;
    let height = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
    };

    const run = (scroll: number) =>
      handlerRef.current({ scroll, vh: window.innerHeight, top, height });

    const onScroll = (e: Event) => run((e as CustomEvent<number>).detail);
    // Re-measure when layout can have shifted, then re-apply at the current spot.
    const remeasure = () => {
      measure();
      run(window.scrollY);
    };

    remeasure();

    window.addEventListener("smooth-scroll", onScroll);
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);

    return () => {
      window.removeEventListener("smooth-scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
    };
  }, [ref]);
}
