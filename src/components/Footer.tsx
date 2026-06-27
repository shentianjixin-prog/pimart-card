"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function Footer() {
  const T = useT();

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#060810]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* 品牌 */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-base font-bold text-white">
              <span className="gradient-text">PIMART</span> CARD
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">{T("brand_tagline")}</p>
          </div>

          {/* 购物指南 */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{T("footer_guide")}</p>
            <div className="flex flex-col gap-2">
              <Link href="/shipping" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_shipping")}</Link>
              <Link href="/guide" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_guide")}</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_contact")}</Link>
            </div>
          </div>

          {/* 法律 */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_privacy")}</Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_terms")}</Link>
              <Link href="/tokusho" className="text-sm text-gray-500 hover:text-gray-300">{T("footer_tokusho")}</Link>
            </div>
          </div>

          {/* 联系 */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{T("footer_contact")}</p>
            <div className="flex flex-col gap-2">
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-300">shentianjixin@gmail.com</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} PIMART CARD. All rights reserved.</p>
          <p className="text-xs text-gray-600">
            {process.env.NEXT_PUBLIC_STRIPE_LIVE === "true"
              ? T("footer_payment_live")
              : T("footer_payment")}
          </p>
        </div>
      </div>
    </footer>
  );
}
