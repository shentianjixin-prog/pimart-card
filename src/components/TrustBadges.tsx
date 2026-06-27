"use client";

import { useT } from "@/lib/lang-context";

const BADGES = [
  { titleKey: "trust_auth_title",  descKey: "trust_auth_desc" },
  { titleKey: "trust_pack_title",  descKey: "trust_pack_desc" },
  { titleKey: "trust_ship_title",  descKey: "trust_ship_desc" },
  { titleKey: "trust_world_title", descKey: "trust_world_desc" },
  { titleKey: "trust_pay_title",   descKey: "trust_pay_desc" },
  { titleKey: "trust_japan_title", descKey: "trust_japan_desc" },
];

export function TrustBadges() {
  const T = useT();
  return (
    <div className="mb-12 border border-[var(--border-subtle)]">
      <div className="grid grid-cols-2 lg:grid-cols-6">
        {BADGES.map((b, i) => (
          <div
            key={b.titleKey}
            className={`flex flex-col gap-2 border-[var(--border-subtle)] bg-[#080808] p-5 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < BADGES.length - 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
          >
            <span className="font-display text-lg text-[var(--gold)] opacity-60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--ivory)]">
              {T(b.titleKey)}
            </p>
            <p className="text-[11px] leading-relaxed text-neutral-600">{T(b.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
