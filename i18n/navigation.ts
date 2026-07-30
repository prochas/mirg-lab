import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation. Always import
// `Link` from here for internal paths — next/link would drop the /en prefix and
// bounce English visitors back to Lithuanian.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
