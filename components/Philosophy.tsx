
import QuoteReveal from "./QuoteReveal";
import ScrollReveal from "./ScrollReveal";

type CustomCard = {
  title: string;
  body: string;
  cta: string;
  img: string;
};

const cards: CustomCard[] = [
  {
    title: "Custom Rings",
    body: "Designed with you, forged for keeps. Bring a sketch, a story, or a stone.",
    cta: "Start a project →",
    img: "/custom/rings.jpg",
  },
  {
    title: "Bespoke Pendants",
    body: "Your story, cast in metal. Limited slots open each month.",
    cta: "Join the waitlist →",
    img: "/custom/pendants.jpg",
  },
];

export default function Philosophy() {
  return (
    <section
      id="story"
      className="mx-[clamp(12px,2vw,28px)] my-[clamp(20px,3vw,40px)] rounded-[clamp(28px,4vw,48px)] bg-black px-[clamp(20px,5vw,80px)] py-[clamp(64px,10vw,140px)] text-white"
    >
      <ScrollReveal className="mb-[clamp(24px,4vw,44px)] text-center text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
        03 / OUR PHILOSOPHY
      </ScrollReveal>

      <QuoteReveal
        text="We Make For The Hands That Refuse To Blend In."
        className="mx-auto mb-[clamp(56px,8vw,110px)] max-w-[14ch] text-center font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.96] tracking-[-0.01em] text-[clamp(2.2rem,7vw,6rem)]"
      />

      <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {cards.map((c, i) => (
          <ScrollReveal
            key={c.title}
            delay={i * 120}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#161616]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.img}
              alt={c.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent to-[62%]" />
            <div className="absolute inset-0 bg-[#ff4d3d]/25 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 z-[2] p-[clamp(22px,3vw,34px)]">
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
    </section>
  );
}
