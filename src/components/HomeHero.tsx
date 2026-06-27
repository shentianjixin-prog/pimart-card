"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/lang-context";

type Tab = "cards" | "notice" | "shipping";

const TAB_KEYS: { id: Tab; labelKey: string; num: string; hasNew?: boolean }[] = [
  { id: "cards", labelKey: "hero_tab_cards", num: "01", hasNew: true },
  { id: "notice", labelKey: "hero_tab_notice", num: "02" },
  { id: "shipping", labelKey: "hero_tab_shipping", num: "03" },
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

  const activeMeta = TAB_KEYS.find((t) => t.id === tab)!;

  return (
    <section className="animate-fade-up mb-12 overflow-hidden border border-[var(--border-subtle)] bg-[#060606]">
      {/* 天野喜孝式金线背景 + Logo 圣域 (~1/8 视口) */}
      <div className="relative border-b border-[var(--border-subtle)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "url(/decor/hero-lines.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div
          className="relative flex flex-col items-center justify-center px-6 py-10 sm:py-12"
          style={{ minHeight: "12.5vh" }}
        >
          <Link href="/" className="block transition hover:opacity-90">
            <Image
              src="/logo.svg"
              alt="PIMART CARD"
              width={320}
              height={78}
              priority
              className="h-auto w-[min(300px,75vw)]"
            />
          </Link>
          <p className="font-display mt-5 text-center text-sm font-light italic tracking-wide text-[var(--gold)]">
            {T("hero_motto")}
          </p>
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.35em] text-neutral-600">
            {T("brand_tagline")}
          </p>
        </div>
      </div>

      {/* 得遇文化式公告编辑区 */}
      <div className="grid lg:grid-cols-[220px_1fr]">
        {/* 左侧 Tab 导航 */}
        <nav className="border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r">
          {TAB_KEYS.map(({ id, labelKey, num, hasNew }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={`relative flex w-full items-center gap-4 border-b border-[var(--border-subtle)] px-6 py-5 text-left transition last:border-b-0 touch-manipulation ${
                tab === id
                  ? "bg-[#0c0c0c] text-[var(--ivory)]"
                  : "text-neutral-500 hover:bg-[#0a0a0a] hover:text-neutral-300"
              }`}
            >
              <span className={`font-display text-2xl font-light ${tab === id ? "text-[var(--gold)]" : "text-neutral-700"}`}>
                {num}
              </span>
              <span className="text-xs uppercase tracking-[0.18em]">{T(labelKey)}</span>
              {hasNew && unread && tab !== id && (
                <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 badge-notify-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* 右侧内容 */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                {activeMeta.num} — {T(activeMeta.labelKey)}
              </p>
              <h2 className="font-display mt-2 text-xl font-light text-[var(--ivory)] sm:text-2xl">
                {T(`hero_${tab}_headline`)}
              </h2>
            </div>
            {unread && tab === "cards" && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-sm border border-red-900/50 bg-red-950/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {T("hero_new_badge")}
              </span>
            )}
          </div>

          <ul className="space-y-5">
            {CONTENT_KEYS[tab].map((key, i) => (
              <li key={key} className="group flex gap-4">
                <span className="font-display mt-0.5 text-lg font-light text-[var(--gold-dim)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-[1.8] text-neutral-400 transition group-hover:text-neutral-200">
                  {T(key)}
                </p>
              </li>
            ))}
          </ul>

          <div className="editorial-rule mt-8" />

          <div className="mt-6 flex flex-wrap gap-6">
            {tab === "shipping" && (
              <Link href="/shipping" className="link-editorial">
                {T("hero_ship_link")} →
              </Link>
            )}
            {tab === "cards" && (
              <Link href="/?sort=newest" className="link-editorial text-sky-400 hover:text-sky-300">
                {T("brand_cta_new")} →
              </Link>
            )}
            {tab === "notice" && (
              <Link href="/guide" className="link-editorial">
                {T("footer_guide")} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
