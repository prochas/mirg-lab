import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Accordion from "@/components/Accordion";
import ScrollReveal from "@/components/ScrollReveal";
import { getFaqGroups } from "@/lib/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.faq" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/faq", locale)
      : undefined,
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("faqPage");
  const groups = getFaqGroups(locale);

  // FAQPage structured data. Google narrowed FAQ *rich results* to authoritative
  // health/government sites in 2023, so don't expect stars in the SERP — this is
  // here because it still describes the page's content unambiguously to crawlers,
  // and it costs nothing to emit from data we already have.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Content is our own static copy, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="noise" />
      <Navbar />

      <main className="relative min-h-screen">
        {/* Banner — same shape as the rings and contacts banners. */}
        <section className="relative overflow-hidden bg-[#111] px-[clamp(18px,4vw,56px)] pb-[clamp(48px,7vw,84px)] pt-[clamp(100px,14vw,160px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/category/bracelets.avif"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#111]/40" />

          <div className="relative z-[2]">
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
            <p className="mt-3.5 max-w-[52ch] text-[15px] font-light text-white/80">
              {t("intro")}
            </p>
          </div>
        </section>

        {/* Groups */}
        <section className="mx-auto max-w-[900px] px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]">
          {groups.map((group, i) => (
            <ScrollReveal
              key={group.id}
              delay={i * 60}
              className="mb-[clamp(32px,5vw,64px)] last:mb-0"
            >
              <h2
                id={group.id}
                className="m-0 mb-[clamp(14px,2vw,22px)] font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.4rem,3.2vw,2.2rem)] text-[#111]"
              >
                {group.title}
              </h2>

              <div>
                {group.items.map((item) => (
                  <Accordion key={item.q} title={item.q} body={item.a} />
                ))}
              </div>
            </ScrollReveal>
          ))}
        </section>

        {/* Closing CTA — anything not answered above goes to a human. */}
        <section className="px-[clamp(18px,4vw,56px)] pb-[clamp(48px,8vw,110px)]">
          <ScrollReveal>
            <div className="mx-auto flex max-w-[900px] flex-col items-start gap-4 rounded-[clamp(20px,3vw,32px)] bg-[#111] px-[clamp(24px,4vw,56px)] py-[clamp(36px,6vw,64px)] text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.4rem,3vw,2rem)]">
                  {t("cta.title")}
                </h2>
                <p className="mt-2 max-w-[46ch] text-[14px] font-light leading-[1.6] text-white/70">
                  {t("cta.body")}
                </p>
              </div>
              <Link
                href="/contacts"
                className="group flex flex-none items-center gap-3 rounded-full bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#111] no-underline transition-colors duration-[350ms] hover:bg-[#ff4d3d] hover:text-white"
              >
                {t("cta.button")}
                <span className="inline-block transition-transform duration-[350ms] group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
