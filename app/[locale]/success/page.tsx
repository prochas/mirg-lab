import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { alternatesFor } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { getStripe } from "@/lib/stripe";
import ClearCart from "./ClearCart";

// Order confirmations are per-customer and must never be cached or prerendered.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.success" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: hasLocale(routing.locales, locale)
      ? alternatesFor("/success", locale)
      : undefined,
    // A receipt has no business in an index.
    robots: { index: false, follow: false },
  };
}

const NEXT_KEYS = ["1", "2", "3"] as const;

/**
 * Looks the session up in Stripe rather than believing the redirect.
 *
 * `session_id` arrives in a URL the customer can edit, so nothing is displayed
 * — and the cart is not cleared — until Stripe confirms the session exists and
 * is paid. A bogus or replayed id just falls through to the generic thank-you.
 */
async function loadOrder(sessionId: string | undefined) {
  if (!sessionId || sessionId.length > 100 || !sessionId.startsWith("cs_")) {
    return null;
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === "paid",
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
      reference: session.id.slice(-8).toUpperCase(),
    };
  } catch {
    // Unknown id, wrong account, or Stripe is down — degrade, don't crash.
    return null;
  }
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { session_id } = await searchParams;
  const t = await getTranslations("success");
  const order = await loadOrder(session_id);
  const paid = order?.paid ?? false;

  const total =
    order?.amountTotal != null
      ? new Intl.NumberFormat(locale === "en" ? "en-IE" : "lt-LT", {
          style: "currency",
          currency: (order.currency ?? "eur").toUpperCase(),
        }).format(order.amountTotal / 100)
      : null;

  return (
    <>
      <div className="noise" />
      <Navbar />
      {/* Only once Stripe says it's paid. */}
      {paid && <ClearCart />}

      <main className="relative flex min-h-screen flex-col items-center px-[clamp(18px,4vw,56px)] pb-[clamp(48px,7vw,84px)] pt-[clamp(120px,16vw,180px)]">
        <div className="w-full max-w-[620px]">
          <div className="mb-[clamp(16px,1.6vw,22px)] flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                paid ? "bg-[#2f9e44]" : "bg-[#7a7a76]"
              } text-white`}
              aria-hidden
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            {paid ? t("eyebrow") : t("pendingTitle")}
          </div>

          <h1 className="m-0 font-[family-name:var(--font-anton)] font-normal uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2.2rem,5.5vw,3.6rem)] text-[#111]">
            {paid ? t("title") : t("pendingTitle")}
          </h1>

          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] font-light text-[#3a3a38]">
            {!paid
              ? t("pendingBody")
              : order?.email
                ? t("body", { email: order.email })
                : t("bodyNoEmail")}
          </p>

          {paid && (order?.reference || total) && (
            <dl className="mt-[clamp(22px,3vw,32px)] flex flex-wrap gap-x-10 gap-y-4 border-t border-[#111]/10 pt-[clamp(22px,3vw,32px)]">
              {order?.reference && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
                    {t("orderLabel")}
                  </dt>
                  <dd className="mt-1 font-[family-name:var(--font-anton)] text-[1.3rem] leading-none text-[#111]">
                    {order.reference}
                  </dd>
                </div>
              )}
              {total && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
                    {t("totalLabel")}
                  </dt>
                  <dd className="mt-1 font-[family-name:var(--font-anton)] text-[1.3rem] leading-none text-[#111]">
                    {total}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {paid && (
            <div className="mt-[clamp(22px,3vw,32px)] border-t border-[#111]/10 pt-[clamp(22px,3vw,32px)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a76]">
                {t("nextTitle")}
              </div>
              <ul className="mt-3 flex flex-col gap-2.5 p-0">
                {NEXT_KEYS.map((k) => (
                  <li
                    key={k}
                    className="flex gap-3 text-[14px] leading-[1.5] font-light text-[#3a3a38]"
                  >
                    <span
                      className="mt-[7px] h-[6px] w-[6px] flex-none rounded-full bg-[#ff4d3d]"
                      aria-hidden
                    />
                    {t(`next.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-[clamp(28px,4vw,40px)] flex flex-wrap items-center gap-4">
            <Link
              href="/products/rings"
              className="rounded-full bg-[#111] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors duration-300 hover:bg-[#ff4d3d]"
            >
              {t("cta")}
            </Link>
            <span className="text-[13px] text-[#7a7a76]">
              {t("help")}{" "}
              <a
                href="mailto:info@mirgalab.com"
                className="text-[#111] underline underline-offset-4 transition-colors duration-300 hover:text-[#ff4d3d]"
              >
                info@mirgalab.com
              </a>
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
