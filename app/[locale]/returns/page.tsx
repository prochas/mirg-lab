import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalSections from "@/components/legal/LegalSections";
import { getReturnsSections, getUpdatedDate } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.returns" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/returns", locale)
      : undefined,
  };
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("returnsPage");
  const sections = getReturnsSections(locale as Locale);
  const updated = getUpdatedDate(locale as Locale);

  return (
    <>
      <div className="noise" />
      <Navbar />

      <main className="relative min-h-screen">
        <section className="relative bg-[#111] px-[clamp(18px,4vw,56px)] pb-[clamp(40px,6vw,64px)] pt-[clamp(100px,14vw,160px)]">
          <div className="mb-[clamp(18px,2.2vw,30px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
            <Link
              href="/"
              className="text-white/60 no-underline hover:text-white"
            >
              {t("breadcrumbHome")}
            </Link>{" "}
            / {t("title")}
          </div>
          <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-white text-[clamp(2rem,5.5vw,3.6rem)]">
            {t("title")}
          </h1>
          <p className="mt-3.5 max-w-[52ch] text-[15px] font-light text-white/80">
            {t("intro")}
          </p>
        </section>

        <section className="mx-auto max-w-[820px] px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]">
          <p className="m-0 mb-[clamp(24px,4vw,40px)] text-[13px] text-[#7a7a76]">
            {t("updated", { date: updated })}
          </p>
          <LegalSections sections={sections} />
        </section>
      </main>

      <Footer />
    </>
  );
}
