import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import type { Locale } from "@/i18n/routing";

/**
 * Server-only Resend client, lazy for the same reason as `getStripe()`
 * (lib/stripe.ts): importing this module must never throw on a machine or
 * build step that doesn't have `RESEND_API_KEY` set.
 */
let cached: Resend | null = null;

function getResend() {
  if (cached) return cached;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing environment variable: RESEND_API_KEY");
  }

  cached = new Resend(key);
  return cached;
}

// TEMPORARY — local testing only, revert once `mirgalab.com` is verified in
// Resend. Sandbox mode only allows sending from `onboarding@resend.dev`, and
// only to the email address the Resend account was signed up with.
// Real value: const FROM = "mirga.lab <info@mirgalab.com>";
const FROM = "mirga.lab <onboarding@resend.dev>";
const REPLY_TO = "info@mirgalab.com";

export type OrderConfirmationLine = {
  name: string;
  description: string;
  quantity: number;
  /** Cents, matching the Stripe line item's `amount_total`. */
  amountTotal: number;
  /** The product photo shown at checkout, if it had one. */
  image?: string;
};

export type OrderConfirmationAddress = {
  name?: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

export type OrderConfirmationInput = {
  to: string;
  locale: Locale;
  reference: string;
  /** ISO currency code, e.g. "eur". */
  currency: string;
  /** Cents — sum of line items before shipping/discount. */
  subtotal: number;
  /** Cents — 0 if free. */
  shippingCost: number;
  /** Cents — 0 if no promotion code was applied. */
  discount: number;
  /** Cents — the actual charge. */
  amountTotal: number;
  lines: OrderConfirmationLine[];
  /** `"<Carrier>: <locker name> — <address>"`, only set for parcel-locker delivery. */
  locker?: string;
  /** Only meaningful for home delivery — a locker order's real destination
   *  is `locker` above, not this (Stripe still collects an address either
   *  way, since the zone-based shipping rate depends on it). */
  shippingAddress?: OrderConfirmationAddress;
  billingAddress?: OrderConfirmationAddress;
  /** e.g. "Visa •••• 4242" — omitted if the payment method couldn't be read. */
  paymentMethod?: string;
  /** Deep link back to `/success?session_id=...` for the "view order" button. */
  viewOrderUrl?: string;
};

function formatCents(cents: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "lt-LT", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAddress(address: OrderConfirmationAddress) {
  const lines = [
    address.name,
    address.line1,
    address.line2,
    `${address.postalCode} ${address.city}`.trim(),
    address.country,
  ].filter(Boolean) as string[];
  return lines.map(escapeHtml).join("<br/>");
}

/**
 * The order confirmation sent once `/api/webhook` sees `checkout.session.completed`.
 *
 * Line names/descriptions/images come from the Stripe line items
 * (`price_data.product_data` set in `/api/checkout`), not re-fetched from
 * Sanity — that keeps the email showing exactly what was charged even if the
 * catalog changes afterwards. Addresses, payment method and the totals
 * breakdown come straight off the Checkout Session — see the comments in
 * `app/api/webhook/route.ts` for exactly which fields.
 *
 * No idempotency guard: a redelivered webhook event resends this email. Accepted
 * MVP trade-off, see CLAUDE.md.
 */
export async function sendOrderConfirmation(input: OrderConfirmationInput) {
  const t = await getTranslations({ locale: input.locale, namespace: "email" });
  const money = (cents: number) => formatCents(cents, input.currency, input.locale);

  const rows = input.lines
    .map(
      (line) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #ececea;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                ${
                  line.image
                    ? `<td style="padding-right:12px;vertical-align:top;">
                         <img src="${line.image}" width="80" height="80" alt="" style="width:80px;height:80px;border-radius:8px;object-fit:cover;display:block;" />
                       </td>`
                    : ""
                }
                <td style="vertical-align:top;">
                  <div style="font-weight:600;color:#111;">${escapeHtml(line.name)}</div>
                  <div style="margin-top:2px;font-size:13px;color:#7a7a76;">${escapeHtml(line.description)}</div>
                  <div style="margin-top:2px;font-size:13px;color:#7a7a76;">${t("qtyLabel", { qty: line.quantity })}</div>
                </td>
              </tr>
            </table>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #ececea;text-align:right;white-space:nowrap;vertical-align:top;font-weight:600;color:#111;">
            ${money(line.amountTotal)}
          </td>
        </tr>`,
    )
    .join("");

  const totalsRow = (label: string, value: string, opts: { bold?: boolean } = {}) => `
    <tr>
      <td style="padding:4px 0;font-size:${opts.bold ? "16px" : "13px"};color:${opts.bold ? "#111" : "#7a7a76"};font-weight:${opts.bold ? "700" : "400"};">${label}</td>
      <td style="padding:4px 0;text-align:right;font-size:${opts.bold ? "16px" : "13px"};color:${opts.bold ? "#111" : "#111"};font-weight:${opts.bold ? "700" : "600"};">${value}</td>
    </tr>`;

  const totals = [
    totalsRow(t("subtotalLabel"), money(input.subtotal)),
    totalsRow(t("shippingCostLabel"), input.shippingCost === 0 ? t("freeLabel") : money(input.shippingCost)),
    input.discount > 0 ? totalsRow(t("discountLabel"), `-${money(input.discount)}`) : "",
    totalsRow(t("totalLabel"), money(input.amountTotal), { bold: true }),
  ].join("");

  const deliveryBlock = input.locker
    ? `<div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a7a76;">${t("lockerLabel")}</div>
       <div style="margin-top:4px;font-size:14px;color:#111;">${escapeHtml(input.locker)}</div>`
    : input.shippingAddress
      ? `<div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a7a76;">${t("shippingAddressLabel")}</div>
         <div style="margin-top:4px;font-size:14px;line-height:1.5;color:#111;">${formatAddress(input.shippingAddress)}</div>`
      : "";

  const billingBlock = input.billingAddress
    ? `<div style="margin-top:16px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a7a76;">${t("billingAddressLabel")}</div>
       <div style="margin-top:4px;font-size:14px;line-height:1.5;color:#111;">${formatAddress(input.billingAddress)}</div>`
    : "";

  const paymentBlock = input.paymentMethod
    ? `<div style="margin-top:16px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a7a76;">${t("paymentLabel")}</div>
       <div style="margin-top:4px;font-size:14px;color:#111;">${escapeHtml(input.paymentMethod)}</div>`
    : "";

  const viewOrderButton = input.viewOrderUrl
    ? `<div style="margin:24px 0;">
         <a href="${input.viewOrderUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding:13px 26px;border-radius:8px;">
           ${t("viewOrderButton")}
         </a>
       </div>`
    : "";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:16px;letter-spacing:-0.01em;color:#111;">mirga.lab</td>
          <td style="text-align:right;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7a7a76;">
            ${t("orderLabel")} ${escapeHtml(input.reference)}
          </td>
        </tr>
      </table>

      <h1 style="margin:0 0 12px;font-size:22px;">${t("title")}</h1>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#3a3a38;">${t("body")}</p>

      ${viewOrderButton}

      <div style="margin:28px 0 12px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#7a7a76;">${t("summaryTitle")}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${rows}
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
        ${totals}
      </table>

      <div style="margin-top:10px;">
        ${deliveryBlock}
        ${billingBlock}
        ${paymentBlock}
      </div>

      <p style="margin-top:36px;padding-top:20px;border-top:1px solid #ececea;font-size:13px;color:#7a7a76;">
        ${t("help")} <a href="mailto:${REPLY_TO}" style="color:#111;">${REPLY_TO}</a>
      </p>
    </div>
  `;

  // Resend's SDK resolves (never throws) on an API-level rejection — it
  // returns `{ data: null, error: {...} }` instead. Verified this the hard
  // way: a sandbox-restricted recipient came back exactly this way, and
  // without checking `.error`, the caller (the webhook) logged nothing and
  // reported success on a mail that never sent.
  const { error } = await getResend().emails.send({
    from: FROM,
    to: input.to,
    replyTo: REPLY_TO,
    subject: t("subject", { reference: input.reference }),
    html,
  });
  if (error) {
    throw new Error(`Resend rejected the send: ${error.message}`);
  }
}
