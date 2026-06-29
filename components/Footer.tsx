const columns = [
  { title: "Shop", links: ["Rings", "Pendants", "Stacks", "Gift cards"] },
  {
    title: "Studio",
    links: ["Our story", "Custom work", "Care guide", "Sizing"],
  },
  {
    title: "Connect",
    links: ["Instagram", "Newsletter", "Stockists", "Contact"],
  },
];

const payments = ["VISA", "MASTERCARD", "AMEX", "PAYPAL"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-[clamp(18px,4vw,56px)] pt-[clamp(56px,8vw,110px)]">
      {/* Columns */}
      <div className="relative z-[2] mx-auto grid max-w-[1320px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[clamp(28px,4vw,56px)]">
        <div className="col-span-full max-w-[520px]">
          <div className="font-[family-name:var(--font-anton)] text-[30px] leading-none">
            mirga
            <span className="font-[family-name:var(--font-epilogue)] font-light">
              .lab
            </span>
          </div>
          <p className="mt-3.5 max-w-[42ch] text-[15px] font-light text-[#3a3a38]">
            Handmade rings and pendants, made in small batches for people
            who&apos;d rather not match everyone else.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a7a76]">
              {col.title}
            </div>
            <div className="flex flex-col gap-[11px]">
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[15px] text-[#111] no-underline transition-colors duration-300 hover:text-[#ff4d3d]"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Payments + credit */}
      <div className="relative z-[2] mx-auto mt-[clamp(40px,6vw,72px)] flex max-w-[1320px] flex-wrap items-center justify-between gap-[18px]  pb-[26px] pt-[22px]">
        <div className="flex flex-wrap items-center gap-2">
          {payments.map((p) => (
            <span
              key={p}
              className="rounded-md border border-[#111]/20 px-[9px] py-[5px] text-[11px] font-semibold tracking-[0.06em] text-[#3a3a38]"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-[18px]">
          <span className="text-[13px] text-[#7a7a76]">
            © 2026 mirga.lab — Built by{" "}
            <span className="inline-block cursor-pointer font-semibold text-[#111] transition-[transform,color] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-[4deg] hover:scale-[1.08] hover:text-[#ff4d3d]">
              stubborn hands
            </span>
            .
          </span>
          <a
            href="#top"
            className="flex items-center gap-[7px] rounded-[11px] border border-[#111]/20 px-3.5 py-[9px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111] no-underline transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
          >
            Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
