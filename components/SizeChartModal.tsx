"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "./LenisProvider";

// Our sizes are the inner diameter in mm (the convention used in LT).
// Circumference = π × diameter; EU (ISO 8653) size is that circumference.
// US sizes are approximate — they fall between half sizes.
const SIZE_ROWS = [
  { lt: "15", circumference: "47.1", eu: "47", us: "≈ 4" },
  { lt: "16", circumference: "50.3", eu: "50", us: "≈ 5.5" },
  { lt: "17", circumference: "53.4", eu: "53", us: "≈ 6.5" },
  { lt: "18", circumference: "56.5", eu: "57", us: "≈ 7.75" },
  { lt: "19", circumference: "59.7", eu: "60", us: "≈ 9" },
  { lt: "20", circumference: "62.8", eu: "63", us: "≈ 10.25" },
  { lt: "21", circumference: "66.0", eu: "66", us: "≈ 11.5" },
  { lt: "22", circumference: "69.1", eu: "69", us: "≈ 12.75" },
  { lt: "23", circumference: "72.3", eu: "72", us: "≈ 14" },
];

const STEPS = [
  "Apjuoskite pirštą siauru popieriaus lankeliu arba siūlu ties storiausia vieta.",
  "Pažymėkite tašką, kur galas persidengia, ir išmatuokite ilgį milimetrais.",
  "Tai — piršto apimtis. Lentelėje raskite artimiausią reikšmę.",
  "Matuokite vakare, kai pirštai šiek tiek patinę. Šaltis juos suplonina.",
];

export default function SizeChartModal({
  open,
  onClose,
  highlightSize,
}: {
  open: boolean;
  onClose: () => void;
  highlightSize?: string | null;
}) {
  useEffect(() => {
    if (!open) return;

    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, onClose]);

  if (!open) return null;

  // The buy panel lives in a `lg:sticky` wrapper, and sticky creates a stacking
  // context — from in there a z-index can never lift the overlay above the fixed
  // navbar. Portal to <body> so it escapes that context entirely.
  // Safe on the server: `open` starts false, so this line is unreachable until
  // a click, which only happens client-side.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Žiedų dydžių lentelė"
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-[#111]/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-[640px] overflow-y-auto rounded-t-[22px] bg-[#f7f6f2] p-[clamp(20px,4vw,36px)] sm:rounded-[22px]"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
              Dydžių lentelė
            </div>
            <h2 className="m-0 font-[family-name:var(--font-anton)] text-[clamp(1.5rem,3.5vw,2.2rem)] font-normal uppercase leading-none tracking-[-0.01em] text-[#111]">
              Kaip išmatuoti dydį
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Uždaryti"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[#111]/20 text-[#111] transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <ol className="mb-8 flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#111] text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-[14px] leading-[1.5] text-[#3a3a38]">
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* Table */}
        <div className="overflow-x-auto rounded-[16px] border border-[#111]/10 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#111]/10">
                {["Dydis (mm)", "Apimtis (mm)", "EU", "US"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => {
                const active = highlightSize === row.lt;
                return (
                  <tr
                    key={row.lt}
                    className={`border-b border-[#111]/[0.06] last:border-b-0 ${
                      active ? "bg-[#ff4d3d]/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-[family-name:var(--font-anton)] text-[16px] ${
                          active ? "text-[#ff4d3d]" : "text-[#111]"
                        }`}
                      >
                        {row.lt}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[14px] text-[#3a3a38]">
                      {row.circumference}
                    </td>
                    <td className="px-4 py-3 text-[14px] text-[#3a3a38]">
                      {row.eu}
                    </td>
                    <td className="px-4 py-3 text-[14px] text-[#7a7a76]">
                      {row.us}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[13px] leading-[1.5] text-[#7a7a76]">
          Mūsų dydis = vidinis žiedo skersmuo milimetrais. US dydžiai —
          apytiksliai. Jei matavimas patenka tarp dviejų dydžių, rinkitės
          didesnį: platesnį žiedą užmauti sunkiau.
        </p>

        <p className="mt-2 text-[13px] leading-[1.5] text-[#7a7a76]">
          Vis tiek abejojate?{" "}
          <a
            href="mailto:uzsakymai@mirga.lab"
            className="font-semibold text-[#111] underline underline-offset-2 transition-colors duration-300 hover:text-[#ff4d3d]"
          >
            Parašykite mums
          </a>{" "}
          — padėsime pasirinkti.
        </p>
      </div>
    </div>,
    document.body,
  );
}
