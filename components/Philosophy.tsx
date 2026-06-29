import QuoteReveal from "./QuoteReveal";
import ScrollReveal from "./ScrollReveal";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

type CustomCard = {
  title: string;
  body: string;
  cta: string;
  img: string;
};

const cards: CustomCard[] = [
  {
    title: "Individualūs Žiedai",
    body: "Sukurti kartu su jumis, kalti amžinybei. Atneškite eskizą, istoriją ar akmenį.",
    cta: "Pradėti projektą →",
    img: "/custom-jewelry-cover.avif",
  },
  {
    title: "Individualūs Pakabukai",
    body: "Jūsų istorija, išlieta metale. Kas mėnesį — ribotas kiekis vietų.",
    cta: "Užsiregistruoti →",
    img: "/custom-grillz-cover.avif",
  },
];

export default function Philosophy() {
  return (
    <section
      id="story"
      className="mx-[clamp(12px,2vw,28px)] my-[clamp(20px,3vw,40px)] rounded-[clamp(28px,4vw,48px)] bg-black px-[clamp(20px,5vw,80px)] py-[clamp(64px,10vw,140px)] text-white"
    >
      <ScrollReveal className="mb-[clamp(24px,4vw,44px)] text-center text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
        03 / MŪSŲ FILOSOFIJA
      </ScrollReveal>

      <QuoteReveal
        text="Kuriame Tiems, Kurie Nenori Būti Kaip Visi."
        className="mx-auto mb-[clamp(56px,8vw,110px)] max-w-[14ch] text-center font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.96] tracking-[-0.01em] text-[clamp(2.2rem,7vw,6rem)]"
      />

      <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {cards.map((c, i) => (
          <ScrollReveal
            key={c.title}
            delay={i * 120}
            className="group flex flex-col overflow-hidden rounded-3xl"
          >
            {/* Image — fully visible, hover zoom/rotate clipped here */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2"
              />
            </div>

            {/* Text panel — frosted glass below the image */}
            <div className="backdrop-blur-md bg-white/5 border-t border-white/10 p-[clamp(22px,3vw,34px)]">
              <div className="font-[family-name:var(--font-anton)] uppercase leading-[0.95] text-[clamp(1.5rem,3vw,2.2rem)]">
                {c.title}
              </div>
              <p className="my-[8px] max-w-[36ch] text-[15px] font-light text-[#cfcfca]">
                {c.body}
              </p>
              <a
                href="#"
                className="border-b-2 border-white pb-[3px] text-[14px] font-semibold text-white no-underline transition-colors duration-[350ms] hover:border-[#ff4d3d] hover:text-[#ff4d3d]"
              >
                {c.cta}
              </a>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Instagram CTA */}
      <div className="mt-[clamp(56px,8vw,110px)] border-t border-white/10 pt-[clamp(48px,7vw,96px)]">
        <ScrollReveal className="flex flex-col items-center text-center">
          <div className="mb-[clamp(18px,3vw,32px)] text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
            04 / FOLLOW ALONG
          </div>

          <a
            href="https://www.instagram.com/mirga.lab"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-[clamp(10px,1.5vw,18px)] no-underline"
          >
            <InstagramIcon className="h-[clamp(22px,3vw,42px)] w-[clamp(22px,3vw,42px)] flex-shrink-0 text-white opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:text-[#ff4d3d]" />
            <span className="font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2rem,7vw,6rem)] text-white transition-colors duration-500 group-hover:text-[#ff4d3d]">
              @mirga.lab
            </span>
          </a>

          <p className="mt-[clamp(14px,2vw,24px)] text-[15px] font-light text-white/50">
            Sekite mus — kūriniai, procesas, naujienos.
          </p>

          <a
            href="https://www.instagram.com/mirga.lab"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[clamp(20px,3vw,36px)] flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-[11px] text-[13px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-all duration-[350ms] hover:border-white/60 hover:bg-white hover:text-[#111]"
          >
            <InstagramIcon className="h-[15px] w-[15px]" />
            Sekti
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
