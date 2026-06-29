"use client";

import { useEffect } from "react";

export default function NoiseLogoController() {
  useEffect(() => {
    const story = document.getElementById("story");
    const logo = document.getElementById("noise-logo");
    if (!story || !logo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Philosophy entered the viewport — hide the logo
          logo.style.opacity = "0";
        } else if (entry.boundingClientRect.top > 0) {
          // Philosophy is below the viewport — user scrolled back up
          logo.style.opacity = "1";
        }
        // If Philosophy is above viewport (scrolled past) — keep hidden
      },
      { threshold: 0 },
    );

    observer.observe(story);
    return () => observer.disconnect();
  }, []);

  return null;
}
