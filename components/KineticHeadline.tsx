export default function KineticHeadline({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <h1
      className={
        "m-0 flex flex-col gap-[0.08em] font-[family-name:var(--font-anton)] font-normal uppercase " +
        "leading-[0.85] tracking-[-0.005em] text-[clamp(3rem,13.5vw,11.5rem)] " +
        className
      }
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}
