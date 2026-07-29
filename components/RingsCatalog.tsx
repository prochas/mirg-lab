"use client";

import { useMemo, useState } from "react";
import RingCard from "./RingCard";
import SortSelect, { type SortOption } from "./SortSelect";
import { RING_MATERIALS, RING_SIZES, type RingProduct } from "@/lib/rings";

type Availability = "all" | "ready" | "made";
type Sort = "default" | "price-asc" | "price-desc";

// "Rikiuoti" doubles as the idle trigger label, so no special-casing is needed.
const SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Rikiuoti" },
  { value: "price-asc", label: "Pigiausi viršuje" },
  { value: "price-desc", label: "Brangiausi viršuje" },
];

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function RingsCatalog({ rings }: { rings: RingProduct[] }) {
  const [materials, setMaterials] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>("all");
  const [sort, setSort] = useState<Sort>("default");

  const filtered = useMemo(() => {
    let list = rings.filter((r) => {
      if (materials.length && !materials.includes(r.material)) return false;
      if (sizes.length && !r.sizeOptions.some((s) => sizes.includes(s)))
        return false;
      if (availability === "ready" && !r.ready) return false;
      if (availability === "made" && r.ready) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [rings, materials, sizes, availability, sort]);

  const hasActiveFilters =
    materials.length > 0 || sizes.length > 0 || availability !== "all";

  function resetFilters() {
    setMaterials([]);
    setSizes([]);
    setAvailability("all");
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-[clamp(24px,3vw,40px)] flex flex-col gap-4">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {RING_MATERIALS.map((m) => {
            const active = materials.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMaterials((prev) => toggle(prev, m))}
                className={`flex-none rounded-full border px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                  active
                    ? "border-[#111] bg-[#111] text-white"
                    : "border-[#111]/20 text-[#111] hover:border-[#111]"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sizes */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            <span className="mr-1 flex-none text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
              Dydis
            </span>
            {RING_SIZES.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSizes((prev) => toggle(prev, s))}
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-[13px] font-semibold transition-colors duration-300 ${
                    active
                      ? "border-[#ff4d3d] bg-[#ff4d3d] text-white"
                      : "border-[#111]/20 text-[#111] hover:border-[#111]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1.5">
            {(
              [
                ["all", "Visi"],
                ["ready", "Paruošta"],
                ["made", "Gaminama"],
              ] as [Availability, string][]
            ).map(([value, label]) => {
              const active = availability === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAvailability(value)}
                  className={`rounded-full border px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                    active
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#111]/20 text-[#111] hover:border-[#111]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <SortSelect
            value={sort}
            defaultValue="default"
            onChange={(v) => setSort(v as Sort)}
            options={SORT_OPTIONS}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7a7a76] underline-offset-4 transition-colors duration-300 hover:text-[#ff4d3d] hover:underline"
            >
              Išvalyti filtrus
            </button>
          )}
        </div>

        <div className="text-[13px] text-[#7a7a76]">
          Rasta {filtered.length} {filtered.length === 1 ? "žiedas" : "žiedai"}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[22px] border border-[#111]/10 bg-[#e9e7df] px-6 py-16 text-center">
          <div className="font-[family-name:var(--font-anton)] uppercase text-[1.3rem] text-[#111]">
            Pagal filtrus žiedų nerasta
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#ff4d3d] underline underline-offset-4"
          >
            Išvalyti filtrus
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
          {filtered.map((r) => (
            <RingCard key={r.slug} ring={r} />
          ))}
        </div>
      )}
    </div>
  );
}
