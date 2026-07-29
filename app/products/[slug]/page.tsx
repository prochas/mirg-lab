import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Accordion from "@/components/Accordion";
import ProductGallery from "@/components/ProductGallery";
import ProductPanel from "@/components/ProductPanel";
import RingCard from "@/components/RingCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getRelatedRings, getRingBySlug, rings } from "@/lib/rings";

export function generateStaticParams() {
  return rings.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ring = getRingBySlug(slug);
  if (!ring) return {};
  return {
    title: `${ring.title} — mirga.lab`,
    description: ring.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ring = getRingBySlug(slug);
  if (!ring) notFound();

  const related = getRelatedRings(slug, 4);

  return (
    <>
      <div className="noise" />
      <Navbar />

      <main className="relative min-h-screen px-[clamp(18px,4vw,56px)] pb-[clamp(48px,7vw,84px)] pt-[clamp(100px,14vw,140px)]">
        {/* Back to catalog + breadcrumb */}
        <div className="mb-[clamp(24px,3vw,40px)] flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
            <Link
              href="/"
              className="text-[#7a7a76] no-underline hover:text-[#111]"
            >
              Pradžia
            </Link>{" "}
            /{" "}
            <Link
              href="/products/rings"
              className="text-[#7a7a76] no-underline hover:text-[#111]"
            >
              Žiedai
            </Link>{" "}
            / <span className="text-[#111]">{ring.title}</span>
          </div>
        </div>

        {/* Gallery + buy panel */}
        <div className="grid grid-cols-1 gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
          <ProductGallery
            images={ring.images}
            title={ring.title}
            ready={ring.ready}
          />

          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2rem,4.5vw,3.2rem)] text-[#111]">
              {ring.title}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="font-[family-name:var(--font-anton)] text-[1.6rem] leading-none text-[#111]">
                {ring.price} €
              </span>
              <span className="text-[13px] text-[#7a7a76]">
                {ring.material}
              </span>
            </div>

            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.6] font-light text-[#3a3a38]">
              {ring.description}
            </p>

            <div className="mt-[clamp(22px,3vw,32px)] border-t border-[#111]/10 pt-[clamp(22px,3vw,32px)]">
              <ProductPanel ring={ring} />
            </div>

            {/* Details */}
            <div className="mt-[clamp(22px,3vw,32px)]">
              {[
                { title: "Specifikacija", items: ring.details },
                {
                  title: "Pristatymas",
                  items: [
                    "Lietuvoje — 2–3 d. d., nemokamai nuo 100 €",
                    "ES šalyse — 4–7 d. d.",
                    "Siunčiame registruotu paštu su sekimo numeriu",
                  ],
                },
                {
                  title: "Priežiūra ir grąžinimas",
                  items: [
                    "Valykite minkšta šluoste, be abrazyvų",
                    "Nusiimkite prieš sportą ir dušą",
                    "Paruoštus žiedus galima grąžinti per 14 d.",
                    "Pagal užsakymą gaminti žiedai negrąžinami",
                  ],
                },
              ].map((section) => (
                <Accordion
                  key={section.title}
                  title={section.title}
                  items={section.items}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Similar rings */}
        {related.length > 0 && (
          <section className="mt-[clamp(56px,9vw,120px)]">
            <ScrollReveal className="mb-[clamp(24px,3vw,44px)] flex flex-wrap items-end justify-between gap-4">
              <div>
                {/* Roomier than the usual mb-2.5 — Anton's caron/macron on
                    "ŠŪ" reach above cap height and crowd the eyebrow. */}
                <div className="mb-[clamp(16px,1.6vw,22px)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
                  Taip pat tiks
                </div>
                <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
                  Panašūs Žiedai
                </h2>
              </div>
              <Link
                href="/products/rings"
                className="rounded-full border border-[#111]/20 px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] no-underline transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
              >
                Visi žiedai
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
              {related.map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 80}>
                  <RingCard ring={r} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
