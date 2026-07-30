import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` file convention to `proxy`; the handler
// signature is unchanged, so next-intl's middleware factory drops straight in.
// This is what resolves `/` to Lithuanian, serves English under `/en`, and
// redirects `/lt/...` to the unprefixed canonical path.
export default createMiddleware(routing);

export const config = {
  // `studio` is excluded on purpose — Sanity Studio is not localised and lives
  // outside the [locale] segment. `api` is excluded so route handlers keep
  // receiving raw requests (the Stripe webhook needs an untouched body).
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
