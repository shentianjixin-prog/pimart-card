"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { WorldTrustMap } from "@/components/HomeWorldTrust";

export function HomeB2B() {
  const T = useT();

  return (
    <section className="home-b2b">
      <div className="home-b2b-panel">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="home-b2b-tag">{T("b2b_v2_tag")}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl lg:text-[2rem]">
              {T("b2b_v2_title")}
            </h2>
            <p className="mt-4 text-base font-medium text-[#374151]">{T("b2b_v2_line1")}</p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#6B7280] sm:text-base">
              {T("b2b_v2_desc")}
            </p>
            <div className="mt-6 flex flex-nowrap gap-2.5 sm:mt-8">
              <Link href="/contact" className="btn-primary min-h-11 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-6">
                {T("hero_v2_cta_quote")}
              </Link>
              <Link href="/contact" className="btn-secondary min-h-11 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-6">
                {T("hero_v2_cta_wholesale")}
              </Link>
            </div>
          </div>

          <div className="home-b2b-map">
            <WorldTrustMap variant="compact" />
            <div className="home-b2b-map-stat">
              <p className="home-b2b-map-stat-value">20+</p>
              <p className="home-b2b-map-stat-label">{T("stats_partners")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
