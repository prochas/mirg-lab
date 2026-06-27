import type { Metadata } from "next";
import { Bodoni_Moda, Geist } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

// Self-hosted + automatically preloaded by Next — no render-blocking Google
// Fonts request, which keeps the hero <h1> (the LCP element) painting fast.
const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mirga.lab — Rings, reimagined",
  description:
    "Modern fine jewellery, designed in our atelier and made to be worn every single day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${bodoni.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
