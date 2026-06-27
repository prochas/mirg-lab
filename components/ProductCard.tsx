import type { Product } from "@/lib/data";
import AddToBagButton from "./AddToBagButton";

// Server Component — static markup. Only <AddToBagButton> is a client island.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(26,26,26,0.08)]">
      <div className="flex aspect-square items-center justify-center border-b border-line bg-card">
        {/* Replace with <Image> once you have real product shots. */}
        <span className="font-mono text-[11px] text-placeholder">
          {product.img}
        </span>
      </div>
      <div className="p-[22px]">
        <div className="mb-[5px] flex items-baseline justify-between gap-3">
          <span className="text-base font-medium tracking-[-0.01em]">
            {product.name}
          </span>
          <span className="text-base font-semibold text-flame">
            {product.price}
          </span>
        </div>
        <div className="mb-[18px] text-[13px] text-muted">
          {product.material}
        </div>
        <AddToBagButton />
      </div>
    </div>
  );
}
