"use client";

import { useLang, useT } from "@/lib/lang-context";
import type { Lang } from "@/lib/translations";

type Announcement = {
  id: string;
  /** ISO date YYYY-MM-DD — newest first, pushes older items down */
  date: string;
  messageKey: string;
};

/** Newest at top; add entries here when publishing updates */
const ANNOUNCEMENTS: Announcement[] = [
  { id: "op-eb06", date: "2025-06-28", messageKey: "announce_op_eb06" },
  { id: "gem-restock", date: "2025-06-18", messageKey: "announce_gem_restock" },
].sort((a, b) => b.date.localeCompare(a.date));

function formatAnnounceDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T00:00:00`);
  if (lang === "en") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function HomeAnnounceBar() {
  const T = useT();
  const { lang } = useLang();

  return (
    <section className="home-announce">
      <div className="home-announce-strip">
        <span className="home-announce-label">{T("announce_title")}</span>
        <ul className="home-announce-list">
          {ANNOUNCEMENTS.map((item) => (
            <li key={item.id} className="home-announce-item">
              <time className="home-announce-date" dateTime={item.date}>
                {formatAnnounceDate(item.date, lang)}
              </time>
              <span className="home-announce-text">{T(item.messageKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
