import Link from "next/link";
import type { RingProduct } from "@/lib/rings";

// Shared by the catalog grid and the "similar rings" row so both stay in sync.
export default function RingCard({ ring }: { ring: RingProduct }) {
  return (
    <Link
      href={`/products/${ring.slug}`}
      className="group block no-underline"
    >
      <div className="relative aspect-[5/6] overflow-hidden rounded-[22px] bg-[#e9e7df]">
        <div className="absolute inset-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ring.images[0]}
            alt={ring.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ring.images[1] ?? ring.images[0]}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        <div
          className={`absolute left-3.5 top-3.5 rounded-full px-3 py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.08em] ${
            ring.ready ? "bg-white/90 text-[#111]" : "bg-[#111]/80 text-white"
          }`}
        >
          {ring.ready ? "Paruošta" : "Gaminama"}
        </div>
      </div>

      <div className="mt-[15px] flex items-baseline justify-between gap-2.5">
        <div className="font-[family-name:var(--font-anton)] uppercase tracking-[0.01em] text-[1.05rem] text-[#111]">
          {ring.title}
        </div>
        <div className="text-[15px] font-medium text-[#111]">
          {ring.price} €
        </div>
      </div>
      <div className="text-[13px] text-[#7a7a76]">{ring.material}</div>
    </Link>
  );
}
