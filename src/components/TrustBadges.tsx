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
    <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
      {BADGES.map((b) => (
        <div key={b.titleKey} className="flex flex-col gap-1 bg-black p-4">
          <p className="text-xs font-semibold text-white leading-tight">{T(b.titleKey)}</p>
          <p className="text-[11px] text-neutral-500 leading-tight">{T(b.descKey)}</p>
        </div>
      ))}
    </div>
  );
}
