"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { WorldTrustMap } from "@/components/HomeWorldTrust";

const PARTNER_CODES = ["JP", "CN", "US", "DE", "SG", "TH"] as const;

export function HomeB2B() {
  const T = useT();

  return (
    <section className="home-b2b">
      <div className="home-b2b-panel">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="home-b2b-tag">{T("b2b_v2_tag")}</p>
            <h2 className="home-b2b-title">{T("b2b_v2_title")}</h2>
            <p className="home-b2b-line">{T("b2b_v2_line1")}</p>
            <p className="home-b2b-desc">{T("b2b_v2_desc")}</p>
            <div className="mt-6 flex flex-nowrap gap-2.5 sm:mt-8">
              <Link
                href="/wholesale"
                className="btn-primary min-h-11 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-6"
              >
                {T("hero_v2_cta_quote")}
              </Link>
              <Link
                href="/wholesale"
                className="btn-secondary min-h-11 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-6"
              >
                {T("hero_v2_cta_wholesale")}
              </Link>
            </div>
          </div>

          <div className="home-b2b-map">
            <WorldTrustMap variant="compact" />
            <div className="home-b2b-map-stat" role="group" aria-label={`20+ ${T("stats_partners")}`}>
              <div className="home-b2b-map-stat-main">
                <span className="home-b2b-map-stat-mark" aria-hidden>
                  NET
                </span>
                <div className="home-b2b-map-stat-copy">
                  <p className="home-b2b-map-stat-value">
                    20<span>+</span>
                  </p>
                  <p className="home-b2b-map-stat-label">{T("stats_partners")}</p>
                </div>
              </div>
              <ul className="home-b2b-map-stat-codes" aria-hidden>
                {PARTNER_CODES.map((code) => (
                  <li key={code} className="home-b2b-map-stat-code">
                    {code}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
