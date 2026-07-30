"use client";

import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

// Drawn as SVG rather than 🇱🇹 / 🇬🇧 on purpose: Windows ships no flag glyphs,
// so the emoji would render as the letters "LT" / "GB" for a chunk of visitors.
function FlagLT() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden className="h-full w-full">
      <rect width="60" height="10" y="0" fill="#fdb913" />
      <rect width="60" height="10" y="10" fill="#006a44" />
      <rect width="60" height="10" y="20" fill="#c1272d" />
    </svg>
  );
}

function FlagGB({ clipId }: { clipId: string }) {
  return (
    <svg viewBox="0 0 60 30" aria-hidden className="h-full w-full">
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clipId})`}
        stroke="#cf142b"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

/**
 * Real <a href> per locale, not buttons calling router.replace(): the other
 * locale's URL has to exist in the markup for crawlers to follow it, and links
 * keep middle-click / open-in-new-tab / copy-link working.
 *
 * Hrefs come from `getPathname`, not from `<Link locale={...}>`. Passing an
 * explicit `locale` to next-intl's Link always writes the prefix — even for the
 * default locale — which would point the Lithuanian link at `/lt`, a URL that
 * only 307-redirects to `/`. `getPathname` honours `localePrefix: 'as-needed'`
 * and yields the canonical path, so neither link is a redirect hop.
 */
export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const active = useLocale();
  // Locale-stripped pathname, so each link points at the same page in its locale.
  const pathname = usePathname();
  const clipId = useId();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center gap-0.5"
    >
      {locales.map((locale) => {
        const current = locale === active;
        return (
          <a
            key={locale}
            href={getPathname({ href: pathname, locale })}
            hrefLang={locale}
            aria-current={current ? "true" : undefined}
            aria-label={t("switchTo", { language: t(locale) })}
            title={t(locale)}
            className={`flex h-10 w-10 items-center justify-center rounded-[11px] transition-colors duration-300 ${
              current ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            <span
              className={`block h-[15px] w-[22px] overflow-hidden rounded-[3px] transition-opacity duration-300 ${
                current ? "opacity-100" : "opacity-45"
              }`}
            >
              {locale === "lt" ? <FlagLT /> : <FlagGB clipId={clipId} />}
            </span>
          </a>
        );
      })}
    </div>
  );
}
