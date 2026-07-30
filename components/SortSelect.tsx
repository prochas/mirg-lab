"use client";

import { useEffect, useRef, useState } from "react";

export type SortOption = { value: string; label: string };

// A native <select> can't be styled — the browser owns its arrow and its option
// list. This is a button + panel so both match the rest of the catalog chips.
export default function SortSelect({
  value,
  options,
  onChange,
  /** Value treated as "nothing chosen" — keeps the trigger in its idle style. */
  defaultValue,
  /** Accessible name for the option list. */
  label,
}: {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  defaultValue: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const active = value !== defaultValue;

  return (
    <div ref={rootRef} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex min-w-[186px] items-center justify-between gap-3 rounded-full border px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
          active || open
            ? "border-[#111] bg-[#111] text-white"
            : "border-[#111]/20 text-[#111] hover:border-[#111]"
        }`}
      >
        {selected.label}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-none transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label={label}
        className={`absolute right-0 top-full z-[500] mt-2 w-[230px] rounded-2xl border border-white/10 bg-[#0c0c0c] p-1.5
                    shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-[opacity,visibility,transform] duration-200 ease-out ${
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
      >
        {options.map((o) => {
          const isSelected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors duration-200 hover:bg-white/10 ${
                isSelected ? "text-[#ff4d3d]" : "text-white"
              }`}
            >
              {o.label}
              {isSelected && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
