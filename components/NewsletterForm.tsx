"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-[10px] border border-[#FFD9C7] bg-white px-6 py-3.5 text-base font-medium text-flame">
        ✓ You&apos;re on the list. Welcome to mirga.lab.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
      className="flex flex-wrap justify-center gap-2.5"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-[240px] flex-1 rounded-[10px] border border-line bg-white px-[18px] py-[15px] text-base text-ink outline-none transition-colors focus:border-orange"
      />
      <button
        type="submit"
        className="grad cursor-pointer rounded-[10px] border-none px-7 py-[15px] text-base font-medium tracking-[-0.01em] text-white shadow-[0_8px_24px_rgba(255,78,0,0.22)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,78,0,0.3)]"
      >
        Subscribe
      </button>
    </form>
  );
}
