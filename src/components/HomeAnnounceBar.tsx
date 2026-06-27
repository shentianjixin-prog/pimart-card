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

function FlowFrameDecor() {
  return (
    <>
      <svg
        className="home-announce-flow home-announce-flow--tl"
        viewBox="0 0 120 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 64 C28 64 36 8 120 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 72 C32 68 44 32 112 24"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
      <svg
        className="home-announce-flow home-announce-flow--br"
        viewBox="0 0 120 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 16 C40 48 72 72 120 80"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 8 C48 36 80 56 120 64"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    </>
  );
}

export function HomeAnnounceBar() {
  const T = useT();
  const { lang } = useLang();

  return (
    <section className="home-announce mb-10 sm:mb-14">
      <div className="home-announce-frame">
        <FlowFrameDecor />
        <div className="home-announce-inner">
          <div className="home-announce-head">
            <span className="home-announce-label">{T("announce_title")}</span>
            <span className="home-announce-head-line" aria-hidden />
          </div>
          <ul className="home-announce-list">
            {ANNOUNCEMENTS.map((item, index) => (
              <li
                key={item.id}
                className="home-announce-item"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <time className="home-announce-date" dateTime={item.date}>
                  {formatAnnounceDate(item.date, lang)}
                </time>
                <span className="home-announce-divider" aria-hidden />
                <span className="home-announce-text">{T(item.messageKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
