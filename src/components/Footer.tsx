"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { PimartLogo } from "@/components/PimartLogo";
import { INSTAGRAM_URL, TWITTER_URL } from "@/lib/site";

export function Footer() {
  const T = useT();

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="PIMARTCARD">
              <PimartLogo height={34} tone="light" />
            </Link>
            <p className="site-footer-muted mt-3 max-w-xs text-sm leading-relaxed">
              {T("footer_tagline")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-contact"
              >
                {T("footer_twitter")} ↗
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-contact"
              >
                {T("footer_instagram")} ↗
              </a>
            </div>
          </div>

          <div>
            <p className="site-footer-heading">{T("footer_company")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="site-footer-link">{T("footer_about")}</Link>
              <Link href="/contact" className="site-footer-link">{T("footer_contact")}</Link>
              <Link href="/buyback" className="site-footer-link">{T("footer_buyback")}</Link>
              <Link href="/wholesale" className="site-footer-link">{T("footer_wholesale")}</Link>
            </div>
          </div>

          <div>
            <p className="site-footer-heading">{T("footer_support")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/guide" className="site-footer-link">{T("footer_guide")}</Link>
              <Link href="/shipping" className="site-footer-link">{T("footer_shipping_policy")}</Link>
              <Link href="/after-sales" className="site-footer-link">{T("footer_after_sales")}</Link>
              <Link href="/faq" className="site-footer-link">{T("footer_faq")}</Link>
            </div>
          </div>

          <div>
            <p className="site-footer-heading">{T("footer_legal")}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/terms" className="site-footer-link">{T("footer_terms")}</Link>
              <Link href="/privacy" className="site-footer-link">{T("footer_privacy")}</Link>
              <Link href="/tokusho" className="site-footer-link">{T("footer_tokusho")}</Link>
              <Link href="/wholesale-terms" className="site-footer-link">{T("footer_wholesale_terms")}</Link>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom mt-12 flex flex-col gap-3 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PIMART CARD</p>
          <p className="text-xs opacity-80">{T("footer_payment")}</p>
        </div>
      </div>
    </footer>
  );
}
