"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { usePathname } from "@/i18n/navigation";

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
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  // Set by popstate so the reset below can tell a link click apart from a
  // back/forward, where jumping to the top would throw away the position the
  // visitor is expecting to return to.
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      // StrictMode runs this effect, tears it down, then runs it again — all
      // before a dynamic import resolves. Without this guard both runs construct
      // an instance, and the orphaned one keeps its own RAF loop writing a stale
      // scroll position to the window every frame. That second, unreachable
      // instance is what silently undoes the reset further down.
      if (cancelled) return;

      lenis = new Lenis({
        lerp: 0.08,

        // Let Lenis own its animation frame, so destroy() cancels it. Driving
        // the loop by hand leaked a RAF whenever the effect was torn down before
        // the import above resolved.
        autoRaf: true,

        // Drop any in-flight inertia when a link to a different page is clicked.
        // Lenis only re-syncs to the window in `onNativeScroll` while
        // `isScrolling` is false or "native" — mid-glide it discards the scroll
        // event Next fires to reset the new page to the top, and the old
        // position wins. This is Lenis's own remedy for that.
        stopInertiaOnNavigate: true,
      });
      instance = lenis;

      lenis.on("scroll", ({ scroll }: { scroll: number }) => {
        window.dispatchEvent(
          new CustomEvent("smooth-scroll", { detail: scroll }),
        );
      });
    });

    return () => {
      cancelled = true;
      // destroy() detaches the scroll/pointer/click listeners, the VirtualScroll
      // and Lenis's own RAF. Previously none of that happened.
      lenis?.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  /**
   * Reset to the top on navigation.
   *
   * `stopInertiaOnNavigate` above covers clicks on real links, which is nearly
   * everything here. This stays as the backstop for navigations that don't come
   * from an anchor (a programmatic `router.push`), where nothing would otherwise
   * tell Lenis the page changed.
   */
  useEffect(() => {
    // Leave the initial render alone, so a reload keeps the browser's own scroll
    // restoration and a deep link with a hash still lands on its target.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Back/forward is the browser's to restore — leave it exactly as it was.
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }

    // Same-page anchors (`/#categories` from /about) change the pathname too —
    // jumping to the top there would fight the anchor the visitor asked for.
    if (window.location.hash) return;

    // `force` because a navigation can start from an overlay that stopped Lenis
    // (the cart drawer), and a stopped instance ignores scrollTo otherwise.
    instance?.resize();
    instance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
