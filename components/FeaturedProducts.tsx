import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFeaturedRings } from "@/lib/rings";
import RingCard from "./RingCard";
import ScrollReveal from "./ScrollReveal";

export default async function FeaturedProducts() {
  const t = await getTranslations("featured");
  const locale = (await getLocale()) as Locale;
  const rings = await getFeaturedRings(locale, 4);

  // An empty catalog should drop the section, not leave a heading over a void.
  if (rings.length === 0) return null;

  return (
    <section
      id="featured"
      className="px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]"
    >
      <ScrollReveal className="mb-[clamp(24px,3vw,44px)] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
            {t("eyebrow")}
          </div>
          <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
            {t("heading")}
          </h2>
        </div>
        <Link
          href="/products/rings"
          className="rounded-full border border-[#111]/20 px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] no-underline transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
        >
          {t("all")}
        </Link>
      </ScrollReveal>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {rings.map((ring, i) => (
          <ScrollReveal key={ring.slug} delay={i * 80}>
            <RingCard ring={ring} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
