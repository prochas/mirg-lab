"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { navLinks } from "@/lib/data";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const { count } = useCart();

  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    const onScroll = () => {
      n.classList.toggle("nav-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={ref}
      className="fixed inset-x-0 top-0 z-[100] border-b border-transparent transition-[background-color,border-color,box-shadow] duration-300"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-8 py-[18px]">
        <Link
          href="#top"
          className="text-[21px] font-semibold tracking-[-0.03em] text-ink no-underline"
        >
          mirga<span className="text-orange">.</span>lab
        </Link>

        <div className="flex items-center gap-[34px]">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[15px] tracking-[-0.01em] text-muted no-underline transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            aria-label="Cart"
            className="relative flex cursor-pointer items-center border-none bg-transparent p-1.5 text-ink"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="grad absolute -right-1 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-[9px] px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
