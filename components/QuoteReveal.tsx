// Brand-philosophy quote that reveals letter-by-letter as it scrolls
// into view — using CSS scroll-driven animations (`animation-timeline`
// + per-letter `animation-range`). No JS, no scroll listeners.
// See the `.quote-letter` rule + `letterIn` keyframe in globals.css.

export default function QuoteReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const chars = Array.from(text);
  const n = chars.length;
  return (
    <p className={className}>
      {chars.map((ch, i) => {
        const start = ((i / n) * 85).toFixed(1);
        const end = ((i / n) * 85 + 16).toFixed(1);
        return (
          <span
            key={i}
            className="quote-letter inline-block"
            style={{ animationRange: `entry ${start}% entry ${end}%` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </p>
  );
}
