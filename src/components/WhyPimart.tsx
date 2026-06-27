"use client";

import { useT } from "@/lib/lang-context";

const REASONS = [
  { titleKey: "why_auth_title", descKey: "why_auth_desc", tint: "#EAF4FF" },
  { titleKey: "why_japan_title", descKey: "why_japan_desc", tint: "#F3EEFF" },
  { titleKey: "why_world_title", descKey: "why_world_desc", tint: "#FFF7D6" },
  { titleKey: "why_pay_title", descKey: "why_pay_desc", tint: "#FFF0F5" },
] as const;

export function WhyPimart() {
  const T = useT();

  return (
    <section className="rounded-[28px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] px-6 py-12 sm:px-10 sm:py-14">
      <div className="mb-8 text-center">
        <h2 className="section-title">{T("why_title")}</h2>
        <p className="section-subtitle">{T("why_subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((item) => (
          <div
            key={item.titleKey}
            className="rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]"
            style={{ background: `linear-gradient(180deg, ${item.tint} 0%, #ffffff 70%)` }}
          >
            <h3 className="text-base font-semibold text-[#111827]">{T(item.titleKey)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{T(item.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
