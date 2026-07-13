"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

const SERVICE_ITEMS = [
  { key: "service_bar_stock", icon: "01" },
  { key: "service_bar_shipping", icon: "02" },
  { key: "service_bar_support", icon: "03" },
] as const;

export function HomeAnnounceBar() {
  const T = useT();

  return (
    <aside className="service-command" aria-label={T("service_bar_label")}>
      <div className="service-command-title">
        <span className="service-command-pulse" aria-hidden="true" />
        {T("service_bar_label")}
      </div>
      <div className="service-command-items" role="list">
        {SERVICE_ITEMS.map((item) => (
          <div key={item.key} className="service-command-item" role="listitem">
            <span aria-hidden="true">{item.icon}</span>
            <p>{T(item.key)}</p>
          </div>
        ))}
      </div>
      <Link href="/?sort=newest" className="service-command-link">
        {T("service_bar_shop")} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
