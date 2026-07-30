/**
 * Pass-through root layout. The real <html>/<body> live in the two branches
 * below it — `app/[locale]/layout.tsx` for the shop and `app/studio/layout.tsx`
 * for Sanity Studio — because only the shop knows which `lang` to set.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
