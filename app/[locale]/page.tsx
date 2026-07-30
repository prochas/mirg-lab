import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Philosophy from "@/components/Philosophy";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import NoiseLogoController from "@/components/NoiseLogoController";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/", locale)
      : undefined,
  };
}

// Fully static, server-rendered. The only client JS is the cart drawer, the
// language switcher and the contact form.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="noise" />
      <div
        className="text-0 pointer-events-none fixed -top-1/2 h-full w-[120%] text-transparent"
        id="noise-logo"
      >
        <svg
          viewBox="0 0 45 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative top-0 left-0 w-full transition-colors duration-500"
          strokeWidth="0.025"
        >
          <path
            d="M0,0 L22.5,32 L45,0 L39,0 L22.5,26 L6,0 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <NoiseLogoController />
      <Navbar />
      <main className="relative min-h-screen">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Philosophy />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
