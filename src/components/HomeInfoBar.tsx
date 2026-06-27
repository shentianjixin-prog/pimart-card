"use client";

import { useT } from "@/lib/lang-context";

const ITEMS = ["info_global", "info_authentic", "info_wholesale", "info_weekly"] as const;

export function HomeInfoBar() {
  const T = useT();

  return (
    <section className="home-info-bar mb-10 sm:mb-12">
      <div className="grid grid-cols-2 gap-3 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)] sm:gap-4 sm:p-5 lg:grid-cols-4">
        {ITEMS.map((key) => (
          <div
            key={key}
            className="flex min-h-11 items-center justify-center px-2 text-center text-sm font-medium text-[#374151] sm:text-[15px]"
          >
            {T(key)}
          </div>
        ))}
      </div>
    </section>
  );
}
