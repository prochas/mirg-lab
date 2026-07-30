import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Cat = {
  key: string;
  title: string;
  img: string;
  href: string;
};

export default async function Categories() {
  const t = await getTranslations("categories");

  const categories: Cat[] = [
    {
      key: "rings",
      title: t("items.rings"),
      img: "/category/rings.avif",
      href: "/products/rings",
    },
    {
      key: "chains",
      title: t("items.chains"),
      img: "/category/chains.avif",
      href: "#featured",
    },
    {
      key: "bracelets",
      title: t("items.bracelets"),
      img: "/category/bracelets.avif",
      href: "#featured",
    },
    {
      key: "earrings",
      title: t("items.earrings"),
      img: "/category/earrings.avif",
      href: "#featured",
    },
  ];

  return (
    <section id="categories" className="py-[clamp(40px,6vw,84px)]">
      {/* Heading */}
      <div className="mb-[clamp(24px,3vw,40px)] px-[clamp(18px,4vw,56px)]">
        <div className="mb-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
          {t("eyebrow")}
        </div>
        <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
          {t("heading")}
        </h2>
      </div>

      {/* Scrollable track */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(14px,2vw,24px)] overflow-x-auto px-[clamp(18px,4vw,56px)] py-1.5">
        {categories.map((c) => {
          const card = (
            <>
              <div className="relative aspect-[5/6] overflow-hidden rounded-[22px] bg-[#e9e7df]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2.5">
                <div className="font-[family-name:var(--font-anton)] uppercase leading-none text-[clamp(1.3rem,2.4vw,1.7rem)] text-[#111]">
                  {c.title}
                </div>
                <div className="text-[13px] text-[#7a7a76]">{t("meta")}</div>
              </div>
            </>
          );

          const className =
            "group w-[clamp(230px,27vw,310px)] flex-none snap-start no-underline";

          // Hash targets stay plain anchors — the locale-aware <Link> is for
          // real paths, and prefixing "#featured" would navigate away.
          return c.href.startsWith("#") ? (
            <a key={c.key} href={c.href} className={className}>
              {card}
            </a>
          ) : (
            <Link key={c.key} href={c.href} className={className}>
              {card}
            </Link>
          );
        })}

        {/* Made-to-order dark card */}
        <a
          href="#story"
          className="group w-[clamp(230px,27vw,310px)] flex-none snap-start no-underline"
        >
          <div className="relative flex aspect-[5/6] items-end overflow-hidden rounded-[22px] bg-[#111] p-6 text-white">
            <div className="absolute inset-0 bg-[#ff4d3d]/25 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100" />
            <div className="relative z-[2]">
              <div className="font-[family-name:var(--font-anton)] uppercase leading-[0.95] text-[clamp(1.6rem,3vw,2.2rem)]">
                {t("custom.line1")}
                <br />
                {t("custom.line2")}
              </div>
              <div className="mt-2.5 text-[13px] text-[#bdbdb8]">
                {t("custom.cta")}
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
