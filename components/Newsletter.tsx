import Reveal from "./Reveal";
import NewsletterForm from "./NewsletterForm";

// Server Component — heading/copy are static; only the form is a client island.
export default function Newsletter() {
  return (
    <section id="contact" className="mx-auto max-w-[1200px] px-8 py-[104px]">
      <Reveal className="mx-auto max-w-[560px] text-center">
        <h2 className="m-0 mb-3.5 font-serif text-[clamp(28px,3.8vw,40px)] font-medium leading-[1.08] tracking-[-0.01em]">
          First look, <em className="italic">first dibs.</em>
        </h2>
        <p className="m-0 mb-8 text-[17px] leading-[1.6] text-muted">
          New drops, restocks and atelier notes — a few times a year, never
          more.
        </p>
        <NewsletterForm />
      </Reveal>
    </section>
  );
}
