"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import { LANGS, LANG_LABELS } from "@/lib/translations";

type SubItem = { labelKey: string; href: string; category?: string };
type NavItem = { labelKey: string; href?: string; sub?: SubItem[]; category?: string };

const NAV_CATEGORY: Record<string, string> = {
  nav_pokemon: "宝可梦原盒",
  nav_one_piece: "海贼王",
  nav_naruto: "火影忍者",
};

const READ_KEY = "pimart-hero-tab-read";

function buildNav(categoryCounts: Record<string, number>): NavItem[] {
  const count = (cat: string) => categoryCounts[cat] ?? 0;
  const hasProducts = (cat: string) => count(cat) > 0;

  const all: NavItem[] = [
    { labelKey: "nav_home", href: "/" },
    {
      labelKey: "nav_pokemon",
      category: "宝可梦原盒",
      sub: [
        { labelKey: "nav_all",     href: "/?category=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%8E%9F%E7%9B%92", category: "宝可梦原盒" },
        { labelKey: "nav_sealed",  href: "/?category=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%8E%9F%E7%9B%92&boxType=%E8%82%A5%E7%9B%92", category: "宝可梦原盒" },
        { labelKey: "nav_loose",   href: "/?category=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%8E%9F%E7%9B%92&boxType=%E7%98%A6%E7%9B%92", category: "宝可梦原盒" },
        { labelKey: "nav_singles", href: "/?category=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%8E%9F%E7%9B%92&boxType=%E5%8D%95%E5%8D%A1", category: "宝可梦原盒" },
      ],
    },
    {
      labelKey: "nav_one_piece",
      category: "海贼王",
      sub: [
        { labelKey: "nav_all",     href: "/?category=%E6%B5%B7%E8%B4%BC%E7%8E%8B", category: "海贼王" },
        { labelKey: "nav_sealed",  href: "/?category=%E6%B5%B7%E8%B4%BC%E7%8E%8B&boxType=%E8%82%A5%E7%9B%92", category: "海贼王" },
        { labelKey: "nav_loose",   href: "/?category=%E6%B5%B7%E8%B4%BC%E7%8E%8B&boxType=%E7%98%A6%E7%9B%92", category: "海贼王" },
        { labelKey: "nav_singles", href: "/?category=%E6%B5%B7%E8%B4%BC%E7%8E%8B&boxType=%E5%8D%95%E5%8D%A1", category: "海贼王" },
      ],
    },
    {
      labelKey: "nav_naruto",
      category: "火影忍者",
      sub: [
        { labelKey: "nav_all",     href: "/?category=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85", category: "火影忍者" },
        { labelKey: "nav_sealed",  href: "/?category=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85&boxType=%E8%82%A5%E7%9B%92", category: "火影忍者" },
        { labelKey: "nav_loose",   href: "/?category=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85&boxType=%E7%98%A6%E7%9B%92", category: "火影忍者" },
        { labelKey: "nav_singles", href: "/?category=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85&boxType=%E5%8D%95%E5%8D%A1", category: "火影忍者" },
      ],
    },
    {
      labelKey: "nav_other_tcg",
      sub: [
        { labelKey: "nav_gundam",     href: "/?category=%E9%AB%98%E8%BE%BE", category: "高达" },
        { labelKey: "nav_dragonball", href: "/?category=%E9%BE%99%E7%8F%A0", category: "龙珠" },
      ],
    },
    { labelKey: "nav_shipping_link", href: "/shipping" },
    { labelKey: "nav_contact_link",  href: "/contact" },
  ];

  return all.filter((item) => {
    if (!item.sub) return true;
    const mainCat = item.category ?? NAV_CATEGORY[item.labelKey];
    if (mainCat && !hasProducts(mainCat)) return false;
    if (item.labelKey === "nav_other_tcg") {
      const visibleSubs = item.sub.filter((s) => s.category && hasProducts(s.category));
      if (visibleSubs.length === 0) return false;
      item.sub = visibleSubs;
    }
    return true;
  });
}

function DesktopDropdown({ items, onClose }: { items: SubItem[]; onClose: () => void }) {
  const T = useT();
  return (
    <div className="absolute left-0 top-full z-50 mt-0.5 min-w-[148px] rounded-lg border border-white/10 bg-black py-1 shadow-2xl">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
        >
          {T(item.labelKey)}
        </Link>
      ))}
    </div>
  );
}

export function Header({ categoryCounts = {} }: { categoryCounts?: Record<string, number> }) {
  const { totalCount } = useCart();
  const { lang, setLang } = useLang();
  const T = useT();
  const [mounted, setMounted] = useState(false);
  const [hasNotify, setHasNotify] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileExp, setMobileExp] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const read = localStorage.getItem(READ_KEY);
    setHasNotify(read !== "1");
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrop(null);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const NAV = buildNav(categoryCounts);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8" style={{ height: 56 }}>

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 leading-none"
          onClick={() => { setMenuOpen(false); setOpenDrop(null); }}
        >
          <Image src="/logo.svg" alt="PIMART CARD" width={120} height={30} className="h-7 w-auto" priority />
        </Link>

        {/* 桌面导航 */}
        <nav ref={navRef} className="ml-4 hidden items-center sm:flex">
          {NAV.map((item) => {
            const hasSub = !!item.sub;
            const isOpen = openDrop === item.labelKey;
            return (
              <div key={item.labelKey} className="relative">
                {hasSub ? (
                  <button
                    type="button"
                    onClick={() => setOpenDrop(isOpen ? null : item.labelKey)}
                    className={`flex items-center gap-0.5 px-3 py-0 text-sm font-medium transition ${isOpen ? "text-white" : "text-gray-400 hover:text-white"}`}
                    style={{ height: 56 }}
                  >
                    {T(item.labelKey)}
                    <svg className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setOpenDrop(null)}
                    className="flex items-center px-3 text-sm font-medium text-gray-400 transition hover:text-white"
                    style={{ height: 56 }}
                  >
                    {T(item.labelKey)}
                  </Link>
                )}
                {hasSub && isOpen && (
                  <DesktopDropdown items={item.sub!} onClose={() => setOpenDrop(null)} />
                )}
              </div>
            );
          })}
        </nav>

        {/* 右侧 */}
        <div className="ml-auto flex items-center gap-1">
          {/* 语言切换 */}
          <div className="flex items-center overflow-hidden rounded border border-white/10">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 text-xs font-bold transition touch-manipulation ${lang === l ? "bg-white text-black" : "text-neutral-500 hover:text-neutral-300"}`}
                style={{ height: 30 }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {/* 消息提醒 */}
          <Link
            href="/"
            className="relative flex items-center justify-center text-neutral-300 transition hover:text-white touch-manipulation"
            style={{ height: 44, width: 44 }}
            title={T("hero_new_badge")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {mounted && hasNotify && (
              <span className="badge-notify right-2 top-2 h-2 w-2 min-w-0 p-0 badge-notify-pulse" />
            )}
          </Link>

          {/* 购物车 */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center text-neutral-300 transition hover:text-white touch-manipulation"
            style={{ height: 44, width: 44 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.706 2.43-7.184.078-.394-.226-.766-.628-.766H5.106M7.5 14.25 5.106 5.106M9.75 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {mounted && totalCount > 0 && (
              <span className="badge-notify right-1 top-1 badge-notify-pulse">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </Link>

          {/* 汉堡 */}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 sm:hidden touch-manipulation"
            style={{ height: 44, width: 44 }}
            onClick={() => { setMenuOpen((o) => !o); setMobileExp(null); }}
            aria-label="菜单"
          >
            <span className={`block h-0.5 w-5 bg-gray-300 transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-300 transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-4 pb-4 sm:hidden">
          <form action="/" className="mb-2 pt-3">
            <input type="text" name="q" placeholder={T("nav_search")} className="input-field py-2" />
          </form>
          <nav>
            {NAV.map((item) => {
              const hasSub = !!item.sub;
              const isExp = mobileExp === item.labelKey;
              return (
                <div key={item.labelKey} className="border-b border-white/5 last:border-0">
                  {hasSub ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between py-3 text-sm font-medium text-gray-300 touch-manipulation"
                        onClick={() => setMobileExp(isExp ? null : item.labelKey)}
                      >
                        {T(item.labelKey)}
                        <svg className={`h-4 w-4 transition-transform ${isExp ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExp && (
                        <div className="mb-2 ml-3 flex flex-col border-l border-white/10 pl-3">
                          {item.sub!.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="py-2 text-sm text-gray-400 hover:text-white touch-manipulation"
                              style={{ minHeight: 40 }}
                              onClick={() => { setMenuOpen(false); setMobileExp(null); }}
                            >
                              {T(sub.labelKey)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="flex items-center py-3 text-sm font-medium text-gray-300 hover:text-white touch-manipulation"
                      onClick={() => { setMenuOpen(false); setMobileExp(null); }}
                    >
                      {T(item.labelKey)}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
