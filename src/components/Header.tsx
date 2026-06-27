"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import { LANGS, LANG_LABELS } from "@/lib/translations";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SearchBar } from "@/components/SearchBar";

type MenuLink = { type: "link"; key: string; href: string };
type MenuGroup = { type: "group"; key: string; children: MenuLink[] };
type ShopMenuItem = MenuLink | MenuGroup;

const SHOP_MENU: ShopMenuItem[] = [
  { type: "link", key: "menu_pokemon", href: "/?category=宝可梦原盒" },
  { type: "link", key: "menu_one_piece", href: "/?q=One%20Piece" },
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
  { key: "menu_new_arrivals", href: "/?sort=newest&inStock=1" },
  { key: "menu_wholesale", href: "/contact" },
  { key: "menu_shipping", href: "/shipping" },
  { key: "menu_guide", href: "/guide" },
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
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition duration-300 hover:bg-[#f7f8fa] hover:text-[#111827]"
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
                className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] transition duration-300 hover:bg-[#f7f8fa] hover:text-[#111827]"
              >
                {T(item.key)}
              </Link>
            ) : (
              <div key={item.key} className="group/sub relative">
                <div className="flex min-h-11 cursor-default items-center justify-between rounded-[14px] px-4 py-3 text-sm text-[#374151] transition duration-300 group-hover/sub:bg-[#f7f8fa]">
                  <span>{T(item.key)}</span>
                  <ChevronRight />
                </div>
                <div className="glass-dropdown invisible absolute left-full top-0 z-50 ml-1 min-w-[220px] p-2 opacity-0 transition duration-200 group-hover/sub:visible group-hover/sub:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] transition duration-300 hover:bg-[#f7f8fa] hover:text-[#111827]"
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
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition duration-300 hover:bg-[#f7f8fa] hover:text-[#111827]"
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
              className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] transition duration-300 hover:bg-[#f7f8fa] hover:text-[#111827]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileShopMenu({
  items,
  T,
  onNavigate,
}: {
  items: ShopMenuItem[];
  T: (key: string) => string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {items.map((item) =>
        item.type === "link" ? (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-11 items-center rounded-[14px] px-3 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
          >
            {T(item.key)}
          </Link>
        ) : (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => setExpanded((k) => (k === item.key ? null : item.key))}
              className="flex min-h-11 w-full items-center justify-between rounded-[14px] px-3 py-3 text-left text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
              aria-expanded={expanded === item.key}
            >
              {T(item.key)}
              <span className={`transition-transform duration-200 ${expanded === item.key ? "rotate-90" : ""}`}>
                <ChevronRight />
              </span>
            </button>
            {expanded === item.key && (
              <div className="ml-3 border-l border-[rgba(17,24,39,0.08)] pl-2">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center rounded-[14px] px-3 py-3 text-sm text-[#6b7280] hover:bg-[#f7f8fa] hover:text-[#111827]"
                  >
                    {T(child.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export function Header() {
  const { totalCount } = useCart();
  const { lang, setLang } = useLang();
  const T = useT();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <AnnouncementBar />
      <header className="glass-header">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-[#111827] sm:text-xl"
            onClick={closeMobile}
          >
            PIMART CARD
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            <Link
              href="/"
              className="flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-[#374151] transition duration-300 hover:bg-[#f7f8fa]"
            >
              {T("nav_home")}
            </Link>
            <ShopNavDropdown label={T("nav_shop")} items={SHOP_MENU} T={T} />
            <NavDropdown label={T("nav_more")} items={moreItems} />
          </nav>

          <div className="hidden min-w-0 flex-1 lg:block lg:max-w-sm xl:max-w-md">
            <SearchBar />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 rounded-full border border-[rgba(17,24,39,0.08)] bg-white/90 p-1 sm:flex">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`touch-target rounded-full px-3 text-xs font-semibold transition duration-300 ${
                    lang === l
                      ? "bg-[#111827] text-white"
                      : "text-[#6b7280] hover:text-[#111827]"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>

            <Link
              href="/cart"
              className="touch-target relative z-10 rounded-full text-[#374151] transition duration-300 hover:bg-[#f7f8fa]"
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
              className="touch-target relative z-10 rounded-full text-[#374151] lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={T("nav_menu")}
              aria-expanded={menuOpen}
            >
              <span className={`block h-0.5 w-6 bg-[#374151] transition-transform duration-300 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`my-1.5 block h-0.5 w-6 bg-[#374151] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-[#374151] transition-transform duration-300 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[104px] z-40 overflow-y-auto overscroll-contain bg-white/96 backdrop-blur-md lg:hidden">
          <div className="border-t border-[rgba(17,24,39,0.08)] px-4 py-5 pb-8">
            <SearchBar className="mb-5" />

            <div className="glass-dropdown mb-4 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{T("nav_shop")}</p>
              <MobileShopMenu items={SHOP_MENU} T={T} onNavigate={closeMobile} />
            </div>

            <div className="glass-dropdown mb-5 p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{T("nav_more")}</p>
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="flex min-h-11 items-center rounded-[14px] px-3 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="sticky bottom-0 flex gap-2 border-t border-[rgba(17,24,39,0.08)] bg-white/96 pt-4 backdrop-blur-sm">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`touch-target flex-1 rounded-full border text-sm font-semibold ${
                    lang === l
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[rgba(17,24,39,0.08)] text-[#6b7280]"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
