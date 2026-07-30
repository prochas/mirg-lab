"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

// Brand names — never translated.
const socials = ["Instagram", "Pinterest", "TikTok"];

export default function Contacts() {
  const t = useTranslations("contacts");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const contactRows = [
    {
      key: "email",
      label: t("rows.email"),
      value: "uzsakymai@mirga.lab",
      href: "mailto:uzsakymai@mirga.lab",
      sub: null,
    },
    {
      key: "phone",
      label: t("rows.phone"),
      value: "+370 600 00000",
      href: "tel:+37060000000",
      sub: null,
    },
    {
      key: "studio",
      label: t("rows.studio"),
      value: t("rows.studioValue"),
      sub: t("rows.studioHours"),
      href: null,
    },
  ];

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
            {t("eyebrow")}
          </div>

          {/* Contact rows */}
          <div className="mt-[clamp(15px,1vw,38px)] flex flex-col">
            {contactRows.map((row) => (
              <div
                key={row.key}
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
              {t("form.title")}
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
                  {t("form.name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("form.namePlaceholder")}
                  className="rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                >
                  {t("form.email")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("form.emailPlaceholder")}
                  className="rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]"
                >
                  {t("form.message")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t("form.messagePlaceholder")}
                  className="resize-none rounded-[10px] border border-[#111]/12 bg-white px-4 py-3 text-[15px] text-[#111] placeholder:text-[#aaa] transition-colors duration-300 focus:border-[#111]/40 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group mt-1 flex w-full items-center justify-center gap-3 rounded-[10px] bg-[#111] py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#ff4d3d] hover:shadow-[0_4px_24px_rgba(255,77,61,0.35)]"
              >
                {t("form.submit")}
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
