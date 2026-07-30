"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ProductGallery({
  images,
  title,
  ready,
}: {
  images: string[];
  title: string;
  ready: boolean;
}) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[5/6] overflow-hidden rounded-[22px] bg-[#e9e7df]">
        {images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src + i}
            src={src}
            alt={i === active ? title : ""}
            aria-hidden={i !== active}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div
          className={`absolute left-3.5 top-3.5 rounded-full px-3 py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.08em] ${
            ready ? "bg-white/90 text-[#111]" : "bg-[#111]/80 text-white"
          }`}
        >
          {ready ? tCommon("ready") : tCommon("made")}
        </div>

        <div className="absolute bottom-3.5 right-3.5 rounded-full bg-[#111]/70 px-3 py-[5px] text-[11px] font-semibold text-white">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t("photo", { title, n: i + 1 })}
            aria-current={i === active}
            className={`relative aspect-square w-[clamp(64px,9vw,88px)] flex-none overflow-hidden rounded-[14px] bg-[#e9e7df] transition-[border-color,opacity] duration-300 ${
              i === active
                ? "border-2 border-[#111] opacity-100"
                : "border-2 border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
