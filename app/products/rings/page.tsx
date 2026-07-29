import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RingsCatalog from "@/components/RingsCatalog";
import { rings } from "@/lib/rings";

export const metadata: Metadata = {
  title: "Žiedai — mirga.lab",
  description: "Rankų darbo žiedai, gaminami mažomis partijomis.",
};

export default function RingsCategoryPage() {
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
                Pradžia
              </Link>{" "}
              / Žiedai
            </div>
            <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-white text-[clamp(2.4rem,7vw,5rem)]">
              Žiedai
            </h1>
            <p className="mt-3.5 max-w-[46ch] text-[15px] font-light text-white/80">
              Kiekvienas žiedas kalamas ranka, mažomis partijomis. Jokių dviejų
              nėra visiškai vienodų.
            </p>
          </div>
        </section>

        {/* Catalog */}
        <section
          id="rings-catalog"
          className="px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]"
        >
          <RingsCatalog rings={rings} />
        </section>
      </main>
      <Footer />
    </>
  );
}
