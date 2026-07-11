"use client";

import Link from "next/link";
import { useLang, useT } from "@/lib/lang-context";
import type { Lang } from "@/lib/translations";

type Announcement = {
  id: string;
  /** ISO date YYYY-MM-DD — newest first */
  date: string;
  messageKey: string;
  ctaKey: string;
  href: string;
};

/** 最新在上；发布时在此追加 */
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "op-eb06",
    date: "2025-06-28",
    messageKey: "announce_op_eb06",
    ctaKey: "announce_cta_preorder",
    href: "/?game=onepiece&stock=preorder",
  },
  {
    id: "gem-restock",
    date: "2025-06-18",
    messageKey: "announce_gem_restock",
    ctaKey: "announce_cta_buy",
    href: `/products/${encodeURIComponent("宝石包第五弹-box-简中")}`,
  },
].sort((a, b) => b.date.localeCompare(a.date));

function formatAnnounceDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T00:00:00`);
  if (lang === "en") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (lang === "ja") {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export function HomeAnnounceBar() {
  const T = useT();
  const { lang } = useLang();

  return (
    <section className="home-announce" aria-label={T("announce_title")}>
      <div className="home-announce-panel">
        <div className="home-announce-head">
          <span className="home-announce-label">{T("announce_title")}</span>
        </div>
        <ul className="home-announce-list">
          {ANNOUNCEMENTS.map((item) => (
            <li key={item.id} className="home-announce-item">
              <div className="home-announce-main">
                <time className="home-announce-date" dateTime={item.date}>
                  {formatAnnounceDate(item.date, lang)}
                </time>
                <span className="home-announce-text">{T(item.messageKey)}</span>
              </div>
              <Link href={item.href} className="home-announce-cta">
                {T(item.ctaKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
