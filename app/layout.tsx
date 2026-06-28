import type { Metadata } from "next";
import { Anton, Epilogue } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

// Display font — heavy, ALL CAPS headings
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// Body font — clean light sans
const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-epilogue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mirga.lab — Handmade rings & pendants",
  description: "Solid metal rings and pendants, made by hand in small batches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${epilogue.variable}`}>
      <body
        id="top"
        className="bg-background font-sans antialiased transition-colors duration-1000 selection:bg-pink-600 selection:text-white page-light"
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
