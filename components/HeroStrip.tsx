"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const IMAGES = [
  "/bg-hero/one.jpg",
  "/bg-hero/two.jpg",
  "/bg-hero/three.jpg",
  "/bg-hero/four.jpg",
  "/bg-hero/five.jpg",
  "/bg-hero/six.jpg",
  "/bg-hero/seven.jpg",
  "/bg-hero/eight.jpg",
  "/bg-hero/nine.jpg",
  "/bg-hero/ten.jpg",
  "/bg-hero/eleven.jpg",
  "/bg-hero/twelve.jpg",
];

export default function HeroStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const scroll = (e as CustomEvent<number>).detail
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(-${scroll * 0.4}px)`
      }
    }
    window.addEventListener('smooth-scroll', onScroll)
    return () => window.removeEventListener('smooth-scroll', onScroll)
  }, []);

  return (
    <div
      className="mt-[clamp(48px,7vw,88px)] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      }}
    >
      <div
        ref={stripRef}
        className="flex gap-[clamp(8px,1vw,12px)] will-change-transform"
        style={{ width: "max-content" }}
      >
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              height: "clamp(200px,28vw,400px)",
              width: "clamp(135px,19vw,268px)",
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 135px, 268px"
              priority={i < 5}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
