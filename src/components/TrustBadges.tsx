"use client";

import { useT } from "@/lib/lang-context";

const BADGES = [
  { icon: "🛡️", titleKey: "trust_auth_title",  descKey: "trust_auth_desc" },
  { icon: "📦", titleKey: "trust_pack_title",  descKey: "trust_pack_desc" },
  { icon: "⚡", titleKey: "trust_ship_title",  descKey: "trust_ship_desc" },
  { icon: "✈️", titleKey: "trust_world_title", descKey: "trust_world_desc" },
  { icon: "🔒", titleKey: "trust_pay_title",   descKey: "trust_pay_desc" },
  { icon: "🇯🇵", titleKey: "trust_japan_title", descKey: "trust_japan_desc" },
];

export function TrustBadges() {
  const T = useT();
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {BADGES.map((b) => (
        <div key={b.titleKey} className="surface flex items-center gap-3 p-3">
          <span className="text-xl shrink-0">{b.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-tight">{T(b.titleKey)}</p>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-tight">{T(b.descKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
