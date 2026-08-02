"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import RingCard from "./RingCard";
import SortSelect, { type SortOption } from "./SortSelect";
import { type RingProduct } from "@/lib/rings";

type Availability = "all" | "ready" | "made";
type Sort = "default" | "price-asc" | "price-desc";

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

// `sizes` is the union of every ring's sizes, resolved on the server — this is a
// client component, so it can't await the catalog itself.
export default function RingsCatalog({
  rings,
  sizes: sizeFilterOptions,
}: {
  rings: RingProduct[];
  sizes: string[];
}) {
  const t = useTranslations("catalog");
  const [materials, setMaterials] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>("all");
  const [sort, setSort] = useState<Sort>("default");

  // Derived from the rings we were handed, so the chip label is already in the
  // active locale while the value we filter on stays the locale-stable key.
  const materialOptions = useMemo(() => {
    const byKey = new Map<string, string>();
    rings.forEach((r) => {
      if (!byKey.has(r.materialKey)) byKey.set(r.materialKey, r.material);
    });
    return Array.from(byKey, ([key, label]) => ({ key, label }));
  }, [rings]);

  // "Sort" doubles as the idle trigger label, so no special-casing is needed.
  const sortOptions: SortOption[] = [
    { value: "default", label: t("sort.default") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
  ];

  const filtered = useMemo(() => {
    let list = rings.filter((r) => {
      if (materials.length && !materials.includes(r.materialKey)) return false;
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
          {materialOptions.map((m) => {
            const active = materials.includes(m.key);
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMaterials((prev) => toggle(prev, m.key))}
                className={`flex-none rounded-full border px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                  active
                    ? "border-[#111] bg-[#111] text-white"
                    : "border-[#111]/20 text-[#111] hover:border-[#111]"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sizes */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            <span className="mr-1 flex-none text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
              {t("filters.size")}
            </span>
            {sizeFilterOptions.map((s) => {
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
                ["all", t("filters.all")],
                ["ready", t("filters.ready")],
                ["made", t("filters.made")],
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
            options={sortOptions}
            label={t("sort.label")}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7a7a76] underline-offset-4 transition-colors duration-300 hover:text-[#ff4d3d] hover:underline"
            >
              {t("filters.clear")}
            </button>
          )}
        </div>

        <div className="text-[13px] text-[#7a7a76]">
          {t("found", { count: filtered.length })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[22px] border border-[#111]/10 bg-[#e9e7df] px-6 py-16 text-center">
          <div className="font-[family-name:var(--font-anton)] uppercase text-[1.3rem] text-[#111]">
            {t("empty.title")}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#ff4d3d] underline underline-offset-4"
          >
            {t("empty.cta")}
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
