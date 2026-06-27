"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function Footer() {
  const T = useT();

  return (
    <footer className="mt-16 border-t border-[rgba(17,24,39,0.08)] bg-[#f7f8fa]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-[#111827]">PIMART CARD</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
              {T("footer_tagline")}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_shop")}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/?category=宝可梦原盒" className="link-muted">{T("menu_pokemon")}</Link>
              <Link href="/?q=PSA" className="link-muted">{T("footer_link_psa")}</Link>
              <Link href="/?inStock=1" className="link-muted">{T("menu_sealed")}</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_support")}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/contact" className="link-muted">{T("footer_contact")}</Link>
              <Link href="/shipping" className="link-muted">{T("footer_shipping")}</Link>
              <Link href="/guide" className="link-muted">{T("footer_guide")}</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_legal")}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="link-muted">{T("footer_privacy")}</Link>
              <Link href="/terms" className="link-muted">{T("footer_terms")}</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-[rgba(17,24,39,0.08)] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PIMART CARD</p>
          <p className="text-xs">{T("footer_payment")}</p>
        </div>
      </div>
    </footer>
  );
}
