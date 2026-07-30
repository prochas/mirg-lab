"use client";

import { useId, useState } from "react";

/**
 * Replaces a native <details>, which cannot animate — the browser shows and
 * hides its content instantly.
 *
 * The open/close animation uses `grid-template-rows: 0fr -> 1fr` rather than
 * max-height: it eases to the content's real height, so nothing is clipped and
 * there's no dead time from an over-estimated max-height.
 *
 * Two content shapes: `items` for a bulleted list (product specs, delivery
 * terms) and `body` for a single prose answer (the FAQ). The union keeps them
 * mutually exclusive, so a caller can't pass both and silently lose one.
 */
type AccordionProps = { title: string } & (
  | { items: string[]; body?: never }
  | { body: string; items?: never }
);

export default function Accordion({ title, items, body }: AccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-t border-[#111]/10 last:border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-[#111] transition-colors duration-300 hover:text-[#ff4d3d]"
      >
        {title}
        <span
          aria-hidden
          className={`flex-none text-[18px] font-normal leading-none transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        {/* The overflow-hidden wrapper is what the collapsing row clips. */}
        <div className="overflow-hidden">
          {body ? (
            <p
              className={`m-0 max-w-[68ch] pb-5 text-[14px] leading-[1.6] text-[#3a3a38] transition-opacity duration-300 ${
                open ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              {body}
            </p>
          ) : (
            <ul
              className={`flex list-none flex-col gap-2 pb-5 pl-0 transition-opacity duration-300 ${
                open ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              {items?.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[14px] leading-[1.5] text-[#3a3a38]"
                >
                  <span className="mt-[9px] h-[4px] w-[4px] flex-none rounded-full bg-[#7a7a76]" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
