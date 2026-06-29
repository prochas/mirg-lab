"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const details = [
  {
    label: "El. paštas",
    value: "uzsakymai@mirga.lab",
    href: "mailto:uzsakymai@mirga.lab",
  },
  {
    label: "Instagram",
    value: "@mirga.lab",
    href: "https://www.instagram.com/mirga.lab",
  },
  { label: "Vieta", value: "Vilnius, Lietuva" },
  { label: "Atsakymas", value: "per 24 val." },
];

export default function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /api/contact
  }

  return (
    <section
      id="contacts"
      className="px-[clamp(18px,4vw,56px)] py-[clamp(40px,6vw,84px)]"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[clamp(48px,6vw,88px)] lg:grid-cols-[1fr_1.4fr]">
        {/* ── Left: brand info ── */}
        <div>
          <ScrollReveal>
            <div className="mb-5.5 text-[13px] font-semibold tracking-[0.12em] text-[#ff4d3d]">
              05 / KONTAKTAI
            </div>
            <h2 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.8rem,4.5vw,3.4rem)]">
              Parašykite Mums
            </h2>
            <p className="mt-5 max-w-[38ch] text-[15px] font-light leading-relaxed text-[#3a3a38]">
              Turite klausimų apie papuošalus, dydžius ar individualų užsakymą?
              Atsakysime kuo greičiau.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80} className="mt-[clamp(32px,4vw,52px)]">
            <div className="flex flex-col gap-[1px] overflow-hidden rounded-[22px] border border-[#111]/10">
              {details.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex items-center justify-between gap-4 px-[22px] py-[17px] ${
                    i % 2 === 0 ? "bg-[#f5f3ef]" : "bg-white"
                  }`}
                >
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
                    {d.label}
                  </span>
                  {d.href ? (
                    <a
                      href={d.href}
                      target={d.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        d.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-[15px] font-medium text-[#111] no-underline transition-colors duration-300 hover:text-[#ff4d3d]"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <span className="text-[15px] font-medium text-[#111]">
                      {d.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Right: contact form ── */}
        <ScrollReveal delay={120}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="contact-name"
                  className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                >
                  Vardas
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jūsų vardas"
                  className="rounded-[14px] border border-[#111]/15 bg-[#f5f3ef] px-5 py-[14px] text-[15px] text-[#111] placeholder:text-[#9a9a96] transition-colors duration-300 focus:border-[#111] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="contact-email"
                  className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                >
                  El. paštas
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jusu@pastas.lt"
                  className="rounded-[14px] border border-[#111]/15 bg-[#f5f3ef] px-5 py-[14px] text-[15px] text-[#111] placeholder:text-[#9a9a96] transition-colors duration-300 focus:border-[#111] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="contact-message"
                className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
              >
                Žinutė
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Parašykite savo klausimą ar komentarą..."
                className="resize-none rounded-[14px] border border-[#111]/15 bg-[#f5f3ef] px-5 py-[14px] text-[15px] text-[#111] placeholder:text-[#9a9a96] transition-colors duration-300 focus:border-[#111] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13px] text-[#7a7a76]">
                Atsakysime per 24 val.
              </p>
              <button
                type="submit"
                className="group flex items-center gap-[10px] rounded-[11px] bg-[#111] px-7 py-[14px] text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#ff4d3d]"
              >
                Siųsti
                <span className="inline-block transition-transform duration-[350ms] group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
