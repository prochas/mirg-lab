import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OpenCartOnLoad from "./OpenCartOnLoad";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.cancel" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/cancel", locale)
      : undefined,
    robots: { index: false, follow: false },
  };
}

/**
 * Where Stripe sends a customer who backed out.
 *
 * Nothing was charged and the cart is untouched — the store is only cleared on
 * `/success`. This page exists mainly to say so plainly, since landing back on
 * the catalog with a full cart and no explanation reads like a failure.
 */
export default async function CancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("cancel");

  return (
    <>
      <div className="noise" />
      <Navbar />

      <main className="relative flex min-h-screen flex-col items-center px-[clamp(18px,4vw,56px)] pb-[clamp(48px,7vw,84px)] pt-[clamp(120px,16vw,180px)]">
        <div className="w-full max-w-[620px]">
          <div className="mb-[clamp(16px,1.6vw,22px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
            {t("eyebrow")}
          </div>

          <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2.2rem,5.5vw,3.6rem)] text-[#111]">
            {t("title")}
          </h1>

          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] font-light text-[#3a3a38]">
            {t("body")}
          </p>

          <div className="mt-[clamp(28px,4vw,40px)] flex flex-wrap items-center gap-4">
            {/* Reopens the drawer rather than linking to a /cart page, which
                doesn't exist — the drawer is the cart. */}
            <OpenCartOnLoad label={t("cta")} />
            <Link
              href="/products/rings"
              className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#111] underline underline-offset-4 transition-colors duration-300 hover:text-[#ff4d3d]"
            >
              {t("browse")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
