"use client";

import { useT } from "@/lib/lang-context";

const ITEMS = ["banner_worldwide", "banner_wholesale", "banner_psa"] as const;

export function AnnouncementBar() {
  const T = useT();
  const line = ITEMS.map((key) => T(key)).join("   ·   ");

  return (
    <div className="announcement-bar border-b border-[rgba(17,24,39,0.06)] bg-[#F8FAFC]">
      <div className="announcement-track py-2.5">
        <span className="announcement-content text-xs font-medium tracking-wide text-[#374151] sm:text-[13px]">
          {line}
          <span aria-hidden className="mx-8">·</span>
          {line}
        </span>
      </div>
    </div>
  );
}
