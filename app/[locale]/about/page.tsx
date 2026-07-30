import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import AboutHero from "@/components/about/AboutHero";
import StoryChapters from "@/components/about/StoryChapters";
import ProcessTrack from "@/components/about/ProcessTrack";
import ValuesList from "@/components/about/ValuesList";
import StatsRow from "@/components/about/StatsRow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/about", locale)
      : undefined,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <>
      <div className="noise" />
      <Navbar />

      <main className="relative min-h-screen">
        <AboutHero />

        {/* Manifesto */}
        <section className="px-[clamp(18px,4vw,56px)] py-[clamp(48px,8vw,110px)]">
          <ScrollReveal>
            <div className="mb-[clamp(16px,1.6vw,22px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
              {t("manifesto.eyebrow")}
            </div>
            <p className="m-0 max-w-[24ch] font-[family-name:var(--font-anton)] font-normal uppercase leading-[1.05] tracking-[-0.01em] text-[clamp(1.6rem,4.5vw,3.4rem)] text-[#111]">
              {t("manifesto.lead")}
              <span className="text-[#7a7a76]">{t("manifesto.rest")}</span>
            </p>
          </ScrollReveal>
        </section>

        <StoryChapters />

        <ProcessTrack />

        <ValuesList />

        {/* Stats */}
        <section className="border-t border-[#111]/10 px-[clamp(18px,4vw,56px)] py-[clamp(48px,8vw,96px)]">
          <StatsRow />
        </section>

        {/* CTA */}
        <section className="px-[clamp(18px,4vw,56px)] pb-[clamp(48px,8vw,110px)]">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[clamp(28px,4vw,48px)] bg-[#111] px-[clamp(24px,5vw,80px)] py-[clamp(56px,9vw,120px)] text-center text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/category/rings.avif"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              {/* Scrim — keeps the sub-line readable over the photo */}
              <div className="absolute inset-0 bg-[#111]/45" />
              <div className="relative z-[2] flex flex-col items-center">
                <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.9rem,6vw,4.4rem)]">
                  {t("cta.title")}
                </h2>
                <p className="mt-4 max-w-[44ch] text-[15px] font-light leading-[1.6] text-white/70">
                  {t("cta.body")}
                </p>

                <div className="mt-[clamp(28px,4vw,44px)] flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/products/rings"
                    className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#111] no-underline transition-colors duration-[350ms] hover:bg-[#ff4d3d] hover:text-white"
                  >
                    {t("cta.rings")}
                    <span className="inline-block transition-transform duration-[350ms] group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/contacts"
                    className="rounded-full border border-white/30 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors duration-[350ms] hover:border-white hover:bg-white hover:text-[#111]"
                  >
                    {t("cta.contact")}
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
