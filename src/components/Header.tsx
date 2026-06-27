"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import { LANGS, LANG_LABELS } from "@/lib/translations";
import { SearchBar } from "@/components/SearchBar";

type MenuLink = { type: "link"; key: string; href: string };
type MenuGroup = { type: "group"; key: string; children: MenuLink[] };
type ShopMenuItem = MenuLink | MenuGroup;

const SHOP_MENU: ShopMenuItem[] = [
  { type: "link", key: "menu_pokemon", href: "/?game=pokemon" },
  { type: "link", key: "menu_one_piece", href: "/?game=onepiece" },
  {
    type: "group",
    key: "menu_other_tcg",
    children: [
      { type: "link", key: "menu_dragon_ball", href: "/?q=Dragon%20Ball" },
      { type: "link", key: "menu_yugioh", href: "/?q=游戏王" },
      { type: "link", key: "menu_gundam", href: "/?q=高达" },
      { type: "link", key: "menu_naruto", href: "/?q=火影" },
      { type: "link", key: "menu_union_arena", href: "/?q=Union%20Arena" },
      { type: "link", key: "menu_weiss", href: "/?q=Weiss%20Schwarz" },
    ],
  },
  {
    type: "group",
    key: "menu_merchandise",
    children: [
      { type: "link", key: "menu_sleeves", href: "/?q=卡套" },
      { type: "link", key: "menu_binders", href: "/?q=卡册" },
      { type: "link", key: "menu_storage", href: "/?q=收纳盒" },
      { type: "link", key: "menu_display", href: "/?q=展示" },
      { type: "link", key: "menu_official", href: "/?q=官方周边" },
      { type: "link", key: "menu_limited_box", href: "/?q=限定礼盒" },
    ],
  },
];

const MORE_MENU = [
  { key: "menu_new_arrivals", href: "/?sort=newest&stock=instock" },
  { key: "menu_wholesale", href: "/contact" },
  { key: "menu_shipping", href: "/shipping" },
  { key: "menu_guide", href: "/guide" },
] as const;

const MOBILE_MENU = [
  { key: "nav_home", href: "/" },
  { key: "nav_shop", href: "/?stock=instock" },
  { key: "menu_wholesale", href: "/contact" },
  { key: "footer_contact", href: "/contact" },
] as const;

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`flex items-center rounded-full border border-[rgba(17,24,39,0.08)] bg-white p-0.5 ${
        compact ? "gap-0" : "gap-0.5"
      }`}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`touch-target rounded-full font-semibold transition duration-200 ${
            compact ? "px-2 text-[10px]" : "px-3 text-xs"
          } ${lang === l ? "bg-[#111827] text-white" : "text-[#6b7280] hover:text-[#111827]"}`}
        >
          {compact ? (l === "ja" ? "日" : l === "zh" ? "中" : "EN") : LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

function ShopNavDropdown({
  label,
  items,
  T,
  onNavigate,
}: {
  label: string;
  items: ShopMenuItem[];
  T: (key: string) => string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f7f8fa]"
        aria-expanded={open}
      >
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div className="glass-dropdown absolute left-0 top-full z-50 mt-2 min-w-[240px] p-2">
          {items.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
              >
                {T(item.key)}
              </Link>
            ) : (
              <div key={item.key} className="group/sub relative">
                <div className="flex min-h-11 items-center justify-between rounded-[14px] px-4 py-3 text-sm text-[#374151] group-hover/sub:bg-[#f7f8fa]">
                  <span>{T(item.key)}</span>
                  <ChevronRight />
                </div>
                <div className="glass-dropdown invisible absolute left-full top-0 z-50 ml-1 min-w-[220px] p-2 opacity-0 transition group-hover/sub:visible group-hover/sub:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
                    >
                      {T(child.key)}
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function NavDropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string }[];
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f7f8fa]"
        aria-expanded={open}
      >
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div className="glass-dropdown absolute left-0 top-full z-50 mt-2 min-w-[220px] p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { totalCount } = useCart();
  const T = useT();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const moreItems = MORE_MENU.map((item) => ({ label: T(item.key), href: item.href }));
  const closeMobile = () => setMenuOpen(false);

  return (
    <div className="sticky top-0 z-50">
      <header className="glass-header">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="min-h-11 shrink-0 content-center text-base font-semibold tracking-tight text-[#111827] sm:text-lg lg:text-xl"
            onClick={closeMobile}
          >
            PIMART CARD
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            <Link href="/" className="flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]">
              {T("nav_home")}
            </Link>
            <ShopNavDropdown label={T("nav_shop")} items={SHOP_MENU} T={T} />
            <NavDropdown label={T("nav_more")} items={moreItems} />
          </nav>

          <div className="hidden min-w-0 flex-1 lg:block lg:max-w-sm xl:max-w-md">
            <SearchBar />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <div className="hidden lg:block">
              <LangSwitcher />
            </div>
            <div className="lg:hidden">
              <LangSwitcher compact />
            </div>

            <Link
              href="/cart"
              className="touch-target relative rounded-full text-[#374151] hover:bg-[#f7f8fa]"
              aria-label={T("nav_cart")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.706 2.43-7.184.078-.394-.226-.766-.628-.766H5.106M7.5 14.25 5.106 5.106M9.75 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {mounted && totalCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111827] px-1 text-[10px] font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="touch-target rounded-full text-[#374151] lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={T("nav_menu")}
              aria-expanded={menuOpen}
            >
              <span className={`block h-0.5 w-6 bg-[#374151] transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`my-1.5 block h-0.5 w-6 bg-[#374151] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-[#374151] transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[52px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="border-t border-[rgba(17,24,39,0.08)] px-4 py-4">
            <SearchBar className="mb-4" />

            <nav className="space-y-1">
              {MOBILE_MENU.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMobile}
                  className="flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
                >
                  {T(item.key)}
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-[rgba(17,24,39,0.08)] pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                {T("nav_lang_label")}
              </p>
              <div className="px-1">
                <LangSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
