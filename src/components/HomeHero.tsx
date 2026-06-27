"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/lang-context";

type Tab = "cards" | "notice" | "shipping";

const TAB_KEYS: { id: Tab; labelKey: string; hasNew?: boolean }[] = [
  { id: "cards", labelKey: "hero_tab_cards", hasNew: true },
  { id: "notice", labelKey: "hero_tab_notice" },
  { id: "shipping", labelKey: "hero_tab_shipping" },
];

const CONTENT_KEYS: Record<Tab, string[]> = {
  cards: ["hero_card_0", "hero_card_1", "hero_card_2"],
  notice: ["ann_0", "ann_1", "ann_2"],
  shipping: ["hero_ship_0", "hero_ship_1", "hero_ship_2"],
};

const READ_KEY = "pimart-hero-tab-read";

export function HomeHero() {
  const T = useT();
  const [tab, setTab] = useState<Tab>("cards");
  const [unread, setUnread] = useState(true);

  useEffect(() => {
    const read = localStorage.getItem(READ_KEY);
    if (read === "1") setUnread(false);
  }, []);

  function selectTab(id: Tab) {
    setTab(id);
    if (id === "cards" && unread) {
      localStorage.setItem(READ_KEY, "1");
      setUnread(false);
    }
  }

  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-white/10 bg-black">
      {/* Logo 区：约 1/8 视口高度 */}
      <div
        className="flex flex-col items-center justify-center border-b border-white/10 bg-black px-6"
        style={{ minHeight: "12.5vh" }}
      >
        <Link href="/" className="block transition opacity-90 hover:opacity-100">
          <Image
            src="/logo.svg"
            alt="PIMART CARD"
            width={280}
            height={70}
            priority
            className="h-auto w-[min(280px,70vw)]"
          />
        </Link>
        <p className="mt-3 text-center text-xs tracking-[0.2em] text-neutral-500 uppercase">
          {T("brand_tagline")}
        </p>
      </div>

      {/* 公告栏 */}
      <div className="bg-[#0a0a0a] px-4 py-5 sm:px-8 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          {TAB_KEYS.map(({ id, labelKey, hasNew }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition touch-manipulation ${
                tab === id
                  ? "bg-white text-black"
                  : "border border-white/15 text-neutral-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {T(labelKey)}
              {hasNew && unread && tab !== id && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0a0a0a]" />
              )}
            </button>
          ))}
          {unread && (
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 badge-notify-pulse" />
              {T("hero_new_badge")}
            </span>
          )}
        </div>

        <ul className="space-y-3">
          {CONTENT_KEYS[tab].map((key) => (
            <li
              key={key}
              className="flex items-start gap-3 border-l-2 border-white/20 pl-4 text-sm leading-relaxed text-neutral-300"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
              <span>{T(key)}</span>
            </li>
          ))}
        </ul>

        {tab === "shipping" && (
          <Link
            href="/shipping"
            className="mt-4 inline-block text-xs text-neutral-400 underline-offset-2 hover:text-white hover:underline"
          >
            {T("hero_ship_link")} →
          </Link>
        )}
        {tab === "cards" && (
          <Link
            href="/?sort=newest"
            className="mt-4 inline-block text-xs text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
          >
            {T("brand_cta_new")} →
          </Link>
        )}
      </div>
    </section>
  );
}
