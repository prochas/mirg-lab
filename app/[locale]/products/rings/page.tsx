import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RingsCatalog from "@/components/RingsCatalog";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { getRings, getRingSizes } from "@/lib/rings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.rings" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/products/rings", locale)
      : undefined,
  };
}

export default async function RingsCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("catalog");
  // Sizes are derived from the whole catalog, not from the filtered rings, so
  // the filter row doesn't change shape as the visitor narrows it down.
  const [rings, sizes] = await Promise.all([getRings(locale), getRingSizes()]);

  return (
    <>
      <div className="noise" />
      <Navbar />
      <main className="relative min-h-screen">
        {/* Banner */}
        <section className="relative overflow-hidden bg-[#111] px-[clamp(18px,4vw,56px)] pb-[clamp(48px,7vw,84px)] pt-[clamp(100px,14vw,160px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/category/rings.avif"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#111]/40" />

          <div className="relative z-[2]">
            {/* Roomier than the usual mb-3.5 — Anton's caron on "Ž" reaches
                above cap height and crowds the breadcrumb. */}
            <div className="mb-[clamp(18px,2.2vw,30px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
              <Link
                href="/"
                className="text-white/60 no-underline hover:text-white"
              >
                {t("breadcrumbHome")}
              </Link>{" "}
              / {t("title")}
            </div>
            <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-white text-[clamp(2.4rem,7vw,5rem)]">
              {t("title")}
            </h1>
            <p className="mt-3.5 max-w-[46ch] text-[15px] font-light text-white/80">
              {t("intro")}
            </p>
          </div>
        </section>

        {/* Catalog */}
        <section
          id="rings-catalog"
          className="px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]"
        >
          <RingsCatalog rings={rings} sizes={sizes} />
        </section>
      </main>
      <Footer />
    </>
  );
}
