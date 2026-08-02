import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Anton, Epilogue } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import LenisProvider from "@/components/LenisProvider";
import CartUIProvider from "@/components/cart/CartUIProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import CookieNotice from "@/components/CookieNotice";
import { routing } from "@/i18n/routing";

// Display font — heavy, ALL CAPS headings
const anton = Anton({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// Body font — clean light sans
const epilogue = Epilogue({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-epilogue",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Only metadataBase lives here — it makes the relative canonical/hreflang paths
// each page builds resolve to absolute URLs, which is what Google requires.
// Per-page titles, descriptions and alternates are set by the pages themselves.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering — without it every page under [locale] opts
  // into dynamic rendering the moment it reads a translation.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${anton.variable} ${epilogue.variable}`}>
      <body
        id="top"
        className="bg-background font-sans antialiased transition-colors duration-1000 selection:bg-pink-600 selection:text-white"
      >
        <NextIntlClientProvider>
          <LenisProvider>
            <CartUIProvider>
              {children}
              <CartDrawer />
              <CookieNotice />
            </CartUIProvider>
          </LenisProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
