"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { PimartLogo } from "@/components/PimartLogo";

export function Footer() {
  const T = useT();

  return (
    <footer className="mt-20 border-t border-[rgba(17,24,39,0.08)] bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="PIMARTCARD">
              <PimartLogo height={34} />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#6b7280]">
              {T("footer_tagline")}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target rounded-full border border-[rgba(17,24,39,0.08)] bg-white text-xs font-semibold text-[#374151] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target rounded-full border border-[rgba(17,24,39,0.08)] bg-white text-xs font-semibold text-[#374151] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                aria-label="X"
              >
                X
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_company")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="link-muted">{T("footer_about")}</Link>
              <Link href="/contact" className="link-muted">{T("footer_contact")}</Link>
              <Link href="/contact" className="link-muted">{T("menu_wholesale")}</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_support")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/shipping" className="link-muted">{T("footer_shipping_policy")}</Link>
              <Link href="/guide" className="link-muted">{T("footer_condition")}</Link>
              <Link href="/faq" className="link-muted">{T("footer_faq")}</Link>
              <Link href="/guide" className="link-muted">{T("footer_guide")}</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_shop")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/?category=宝可梦原盒" className="link-muted">{T("menu_pokemon")}</Link>
              <Link href="/?q=PSA" className="link-muted">{T("footer_link_psa")}</Link>
              <Link href="/?inStock=1" className="link-muted">{T("menu_sealed")}</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111827]">{T("footer_legal")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/privacy" className="link-muted">{T("footer_privacy")}</Link>
              <Link href="/terms" className="link-muted">{T("footer_terms")}</Link>
              <Link href="/tokusho" className="link-muted">{T("footer_tokusho")}</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[rgba(17,24,39,0.08)] pt-8 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PIMART CARD</p>
          <p className="text-xs">{T("footer_payment")}</p>
        </div>
      </div>
    </footer>
  );
}
