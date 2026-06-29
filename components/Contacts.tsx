"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const contactRows = [
  {
    label: "El. paštas",
    value: "uzsakymai@mirga.lab",
    href: "mailto:uzsakymai@mirga.lab",
  },
  {
    label: "Telefonas",
    value: "+370 600 00000",
    href: "tel:+37060000000",
  },
  {
    label: "Studija",
    value: "Aušros Vartų g. 12, Vilnius, Lietuva",
    sub: "Tik iš anksto · Kt–Š 11–18",
    href: null,
  },
];

const socials = ["Instagram", "Pinterest", "TikTok"];

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
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[clamp(48px,6vw,80px)] lg:grid-cols-[1fr_1.1fr]">
        {/* ── Left ── */}
        <ScrollReveal className="flex flex-col">
          <div className="mb-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
            05 / KONTAKTAI
          </div>

          {/* Contact rows */}
          <div className="mt-[clamp(15px,1vw,38px)] flex flex-col">
            {contactRows.map((row) => (
              <div
                key={row.label}
                className="border-t border-[#111]/10 py-5 first:border-t-0"
              >
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
                  {row.label}
                </div>
                {row.href ? (
                  <a
                    href={row.href}
                    className="font-[family-name:var(--font-anton)] text-[clamp(1.2rem,2.2vw,1.7rem)] uppercase leading-none tracking-[-0.01em] text-[#111] no-underline transition-colors duration-300 hover:text-[#ff4d3d]"
                  >
                    {row.value}
                  </a>
                ) : (
                  <div className="font-[family-name:var(--font-anton)] text-[clamp(1.2rem,2.2vw,1.7rem)] uppercase leading-[1.2] tracking-[-0.01em] text-[#111] whitespace-pre-line">
                    {row.value}
                  </div>
                )}
                {row.sub && (
                  <div className="mt-1.5 text-[13px] text-[#7a7a76]">
                    {row.sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border border-[#111]/20 px-4 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] no-underline transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
              >
                {s}
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Right: form card ── */}
        <ScrollReveal delay={100}>
          <div className="rounded-[20px] border border-[#111]/10 bg-white p-[clamp(24px,4vw,44px)]">
            <h3 className="mb-6 font-[family-name:var(--font-anton)] text-[clamp(1.3rem,2.5vw,1.9rem)] font-normal uppercase leading-none tracking-[-0.01em] text-[#111]">
              Susisiekite su mumis
            </h3>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
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
                  className="rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
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
                  className="rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                >
                  Ką Norite Sukurti?
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Žiedas, pakabukas, idėja ant servetėlės..."
                  className="resize-none rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group mt-1 flex w-full items-center justify-center gap-3 rounded-[10px] bg-[#111] py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#ff4d3d] hover:shadow-[0_4px_24px_rgba(255,77,61,0.35)]"
              >
                Siųsti Žinutę
                <span className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1.5">
                  →
                </span>
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
