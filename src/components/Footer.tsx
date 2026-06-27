"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function Footer() {
  const T = useT();

  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-black">
      <div className="editorial-rule" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl font-light tracking-wide text-[var(--ivory)]">PIMART CARD</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-neutral-600">{T("brand_tagline")}</p>
          </div>
          <p className="font-display text-sm italic text-[var(--gold)] opacity-70">{T("hero_motto")}</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">{T("footer_guide")}</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/shipping" className="link-muted text-sm">{T("footer_shipping")}</Link>
              <Link href="/guide" className="link-muted text-sm">{T("footer_guide")}</Link>
              <Link href="/contact" className="link-muted text-sm">{T("footer_contact")}</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">Legal</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/privacy" className="link-muted text-sm">{T("footer_privacy")}</Link>
              <Link href="/terms" className="link-muted text-sm">{T("footer_terms")}</Link>
              <Link href="/tokusho" className="link-muted text-sm">{T("footer_tokusho")}</Link>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">{T("footer_contact")}</p>
            <Link href="/contact" className="link-muted text-sm">shentianjixin@gmail.com</Link>
          </div>
        </div>

        <div className="editorial-rule mb-6" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-neutral-600">© {new Date().getFullYear()} PIMART CARD</p>
          <p className="text-[11px] text-neutral-600">
            {process.env.NEXT_PUBLIC_STRIPE_LIVE === "true"
              ? T("footer_payment_live")
              : T("footer_payment")}
          </p>
        </div>
      </div>
    </footer>
  );
}
