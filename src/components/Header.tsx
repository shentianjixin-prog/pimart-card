"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import type { Lang } from "@/lib/translations";
import { SearchBar } from "@/components/SearchBar";
import { PimartLogo } from "@/components/PimartLogo";
import type { MemberSession } from "@/lib/session";

/** 顶栏横铺分类（宝可梦单独悬停菜单） */
const PRIMARY_NAV = [
  { key: "menu_one_piece", href: "/?game=onepiece" },
  { key: "menu_naruto", href: "/?q=火影" },
] as const;

/** 宝可梦悬停子项 */
const POKEMON_SUBNAV = [
  { key: "menu_pokemon_booster", href: "/?game=pokemon&type=expansion" },
  { key: "menu_pokemon_gift", href: "/?game=pokemon&type=gift" },
  { key: "menu_pokemon_merch", href: "/?game=pokemon&type=set" },
] as const;

/** 「其他 TCG」下拉 */
const OTHER_TCG_MENU = [
  { key: "menu_dragon_ball", href: "/?q=Dragon%20Ball" },
  { key: "menu_yugioh", href: "/?q=游戏王" },
  { key: "menu_gundam", href: "/?q=高达" },
  { key: "menu_union_arena", href: "/?q=Union%20Arena" },
  { key: "menu_weiss", href: "/?q=Weiss%20Schwarz" },
] as const;

const MORE_MENU = [
  { key: "menu_wholesale", href: "/wholesale" },
  { key: "menu_shipping", href: "/shipping" },
  { key: "menu_guide", href: "/guide" },
] as const;

function PokemonNavHover() {
  const T = useT();

  return (
    <div className="group/pokemon relative">
      <Link
        href="/?game=pokemon"
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition group-hover/pokemon:bg-[#f7f8fa]"
      >
        {T("menu_pokemon")}
        <ChevronDown />
      </Link>
      <div className="pointer-events-none invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition duration-150 group-hover/pokemon:pointer-events-auto group-hover/pokemon:visible group-hover/pokemon:opacity-100">
        <div className="nav-pokemon-submenu glass-dropdown" role="menu" aria-label={T("menu_pokemon")}>
          {POKEMON_SUBNAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              role="menuitem"
              className="nav-pokemon-item"
            >
              {T(item.key)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function LanguageMenuItems({
  onSelect,
  nested = false,
}: {
  onSelect?: () => void;
  nested?: boolean;
}) {
  const { lang, setLang } = useLang();
  const T = useT();

  const options: { code: Lang; labelKey: string }[] = [
    { code: "zh", labelKey: "nav_lang_zh" },
    { code: "ja", labelKey: "nav_lang_ja" },
    { code: "en", labelKey: "nav_lang_en" },
  ];

  return (
    <div className={nested ? "space-y-0.5" : "space-y-1"}>
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => {
            setLang(opt.code);
            onSelect?.();
          }}
          className={`flex min-h-11 w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm transition hover:bg-[#f7f8fa] ${
            lang === opt.code ? "font-semibold text-[#111827]" : "text-[#374151]"
          }`}
        >
          <span>{T(opt.labelKey)}</span>
          {lang === opt.code && (
            <span className="h-2 w-2 rounded-full bg-[#111827]" aria-hidden />
          )}
        </button>
      ))}
    </div>
  );
}

function SimpleNavDropdown({
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
    <div ref={ref} className="relative">
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

function MoreNavDropdown({
  label,
  linkItems,
  onNavigate,
  triggerClassName,
}: {
  label: string;
  linkItems: { label: string; href: string }[];
  onNavigate?: () => void;
  triggerClassName?: string;
}) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setLangOpen(false);
        }}
        className={
          triggerClassName ??
          "flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f7f8fa]"
        }
        aria-expanded={open}
      >
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div className="glass-dropdown absolute left-0 top-full z-50 mt-2 min-w-[240px] p-2">
          {linkItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setOpen(false);
                setLangOpen(false);
                onNavigate?.();
              }}
              className="block min-h-11 rounded-[14px] px-4 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
            >
              {item.label}
            </Link>
          ))}

          <div className="my-1 border-t border-[rgba(17,24,39,0.08)]" />

          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex min-h-11 w-full items-center justify-between rounded-[14px] px-4 py-3 text-sm text-[#374151] hover:bg-[#f7f8fa]"
            aria-expanded={langOpen}
          >
            <span>{T("nav_lang_label")}</span>
            <span className={`transition ${langOpen ? "rotate-90" : ""}`}>
              <ChevronRight />
            </span>
          </button>

          {langOpen && (
            <div className="mt-0.5 rounded-[14px] bg-[#f7f8fa]/80 p-1">
              <LanguageMenuItems
                nested
                onSelect={() => {
                  setOpen(false);
                  setLangOpen(false);
                  onNavigate?.();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header({ member }: { member?: MemberSession | null }) {
  const { totalCount } = useCart();
  const T = useT();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobilePokemonOpen, setMobilePokemonOpen] = useState(false);
  const [mobileOtherOpen, setMobileOtherOpen] = useState(false);

  function closeMobile() {
    setMenuOpen(false);
    setMobileLangOpen(false);
    setMobilePokemonOpen(false);
    setMobileOtherOpen(false);
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileLangOpen(false);
        setMobilePokemonOpen(false);
        setMobileOtherOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const moreItems = MORE_MENU.map((item) => ({ label: T(item.key), href: item.href }));
  const otherTcgItems = OTHER_TCG_MENU.map((item) => ({ label: T(item.key), href: item.href }));
  return (
    <div className="sticky top-0 z-50">
      <header className="glass-header">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 lg:px-8">
          <button
            type="button"
            className="btn-ghost min-h-10 shrink-0 px-3 text-sm lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? T("nav_menu_close") : T("nav_menu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? T("nav_menu_close") : T("nav_menu")}
          </button>

          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center"
            onClick={closeMobile}
            aria-label="PIMARTCARD"
          >
            <PimartLogo height={34} className="h-[34px] w-auto max-w-[min(70vw,210px)] sm:h-9 sm:max-w-[220px]" />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <PokemonNavHover />
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
              >
                {T(item.key)}
              </Link>
            ))}
            <SimpleNavDropdown label={T("menu_other_tcg")} items={otherTcgItems} />
            <Link href="/buyback" className="nav-pill nav-pill-buyback">
              {T("menu_buyback")}
            </Link>
            <MoreNavDropdown
              label={T("nav_more")}
              linkItems={moreItems}
              triggerClassName="nav-pill nav-pill-support"
            />
          </nav>

          <div className="ml-2 hidden w-[148px] shrink-0 lg:block xl:w-[180px]">
            <SearchBar />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex items-center">
              {member ? (
                <Link
                  href="/account"
                  className="min-h-10 max-w-[100px] truncate rounded-full px-2 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa] sm:max-w-[120px] sm:px-3 lg:max-w-[140px]"
                  title={member.email}
                >
                  {member.name}
                </Link>
              ) : (
                <Link href="/account/login" className="btn-ghost min-h-10 px-3 text-sm">
                  {T("nav_login")}
                </Link>
              )}
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
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[52px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="border-t border-[rgba(17,24,39,0.08)] px-4 py-4">
            <SearchBar className="mb-4" />

            <nav className="space-y-1">
              {/* 宝可梦：默认收起，点箭头展开 */}
              <div>
                <div className="flex items-center gap-1">
                  <Link
                    href="/?game=pokemon"
                    onClick={closeMobile}
                    className="flex min-h-11 flex-1 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
                  >
                    {T("menu_pokemon")}
                  </Link>
                  <button
                    type="button"
                    className="touch-target rounded-full text-[#6b7280] hover:bg-[#f7f8fa]"
                    aria-expanded={mobilePokemonOpen}
                    aria-label={T("menu_pokemon")}
                    onClick={() => setMobilePokemonOpen((v) => !v)}
                  >
                    <span className={`inline-flex transition ${mobilePokemonOpen ? "rotate-180" : ""}`}>
                      <ChevronDown />
                    </span>
                  </button>
                </div>
                {mobilePokemonOpen && (
                  <div className="mb-1 space-y-0.5 pl-2">
                    {POKEMON_SUBNAV.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center rounded-[14px] px-4 text-sm text-[#6b7280] hover:bg-[#f7f8fa]"
                      >
                        {T(item.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMobile}
                  className="flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
                >
                  {T(item.key)}
                </Link>
              ))}

              {/* 其他 TCG：默认收起 */}
              <div>
                <div className="flex items-center gap-1">
                  <Link
                    href="/?q=TCG"
                    onClick={closeMobile}
                    className="flex min-h-11 flex-1 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
                  >
                    {T("menu_other_tcg")}
                  </Link>
                  <button
                    type="button"
                    className="touch-target rounded-full text-[#6b7280] hover:bg-[#f7f8fa]"
                    aria-expanded={mobileOtherOpen}
                    aria-label={T("menu_other_tcg")}
                    onClick={() => setMobileOtherOpen((v) => !v)}
                  >
                    <span className={`inline-flex transition ${mobileOtherOpen ? "rotate-180" : ""}`}>
                      <ChevronDown />
                    </span>
                  </button>
                </div>
                {mobileOtherOpen && (
                  <div className="mb-1 space-y-0.5 pl-2">
                    {OTHER_TCG_MENU.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center rounded-[14px] px-4 text-sm text-[#6b7280] hover:bg-[#f7f8fa]"
                      >
                        {T(item.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {[
                { key: "menu_buyback", href: "/buyback", className: "nav-pill nav-pill-buyback w-full justify-center" },
                { key: "menu_wholesale", href: "/wholesale", className: "flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]" },
                { key: "footer_contact", href: "/contact", className: "flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]" },
                { key: "nav_account", href: "/account", className: "flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMobile}
                  className={item.className}
                >
                  {T(item.key)}
                </Link>
              ))}

              {!member && (
                <Link
                  href="/account/login"
                  onClick={closeMobile}
                  className="btn-ghost mt-1 w-full"
                >
                  {T("nav_login")}
                </Link>
              )}
            </nav>

            <div className="mt-5 border-t border-[rgba(17,24,39,0.08)] pt-4">
              <button
                type="button"
                onClick={() => setMobileLangOpen((v) => !v)}
                className="flex min-h-11 w-full items-center justify-between rounded-[14px] px-3 text-sm font-medium text-[#374151] hover:bg-[#f7f8fa]"
                aria-expanded={mobileLangOpen}
              >
                <span>{T("nav_lang_label")}</span>
                <span className={`transition ${mobileLangOpen ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>
              {mobileLangOpen && (
                <div className="mt-1 rounded-[14px] bg-[#f7f8fa]/80 p-1">
                  <LanguageMenuItems onSelect={closeMobile} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
