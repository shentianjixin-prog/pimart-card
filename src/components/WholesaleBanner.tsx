"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function WholesaleBanner() {
  const T = useT();

  return (
    <section className="overflow-hidden rounded-[28px] border border-[rgba(17,24,39,0.08)] bg-white shadow-[0_8px_30px_rgba(17,24,39,0.06)]">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
            {T("wholesale_tag")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
            {T("wholesale_title")}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6b7280] sm:text-base">
            {T("wholesale_desc")}
          </p>
          <div className="mt-6">
            <Link href="/wholesale" className="btn-primary">
              {T("wholesale_cta")}
            </Link>
          </div>
        </div>
        <div
          className="min-h-[220px] bg-[linear-gradient(135deg,#EAF4FF_0%,#F3EEFF_50%,#FFF7D6_100%)] lg:min-h-full"
          aria-hidden
        />
      </div>
    </section>
  );
}
