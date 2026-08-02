import type { LegalSection } from "@/lib/legal";

/** Renders the heading/paragraph/list content shared by the three legal pages. */
export default function LegalSections({
  sections,
}: {
  sections: LegalSection[];
}) {
  return (
    <div className="flex flex-col gap-[clamp(28px,4vw,44px)]">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="m-0 mb-3 font-[family-name:var(--font-anton)] font-normal uppercase leading-[1.1] tracking-[-0.01em] text-[clamp(1.1rem,2.2vw,1.5rem)] text-[#111]">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p
              key={p}
              className="m-0 mt-3 max-w-[68ch] text-[15px] leading-[1.7] text-[#3a3a38] first:mt-0"
            >
              {p}
            </p>
          ))}
          {section.list && (
            <ul className="mt-3 flex list-none flex-col gap-2 pl-0">
              {section.list.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[15px] leading-[1.6] text-[#3a3a38]"
                >
                  <span className="mt-[10px] h-[4px] w-[4px] flex-none rounded-full bg-[#7a7a76]" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
