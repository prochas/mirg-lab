import "../globals.css";

/**
 * Studio gets its own root layout: it sits outside the [locale] segment (Sanity
 * Studio has its own UI language) and the pass-through layout above renders no
 * <html>/<body> of its own.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
