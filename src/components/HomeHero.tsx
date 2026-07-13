"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { HeroBrandVisual } from "@/components/home/HeroVisuals";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const DISCOVERY_LINKS = [
  { key: "hero_quick_pokemon", href: "/?game=pokemon" },
  { key: "hero_quick_onepiece", href: "/?game=onepiece" },
  { key: "hero_quick_instock", href: "/?stock=instock" },
  { key: "hero_quick_preorder", href: "/?stock=preorder" },
] as const;

const SERVICE_FACTS = [
  { valueKey: "hero_fact_auth_value", labelKey: "hero_fact_auth_label" },
  { valueKey: "hero_fact_ship_value", labelKey: "hero_fact_ship_label" },
  { valueKey: "hero_fact_b2b_value", labelKey: "hero_fact_b2b_label" },
] as const;

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const T = useT();

  return (
    <section className="premium-hero" aria-labelledby="premium-hero-title">
      <div className="premium-hero-aura premium-hero-aura-one" aria-hidden="true" />
      <div className="premium-hero-aura premium-hero-aura-two" aria-hidden="true" />

      <div className="premium-hero-inner">
        <div className="premium-hero-copy">
          <p className="premium-hero-kicker">
            <span className="premium-hero-kicker-dot" aria-hidden="true" />
            {T("hero_premium_kicker")}
          </p>
          <h1 id="premium-hero-title" className="premium-hero-title">
            {T("hero_premium_title")}
          </h1>
          <p className="premium-hero-lead">{T("hero_premium_lead")}</p>

          <div className="premium-hero-actions">
            <Link href="/?sort=newest&stock=instock" className="premium-hero-primary">
              {T("hero_v2_cta_new")}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/wholesale" className="premium-hero-secondary">
              {T("hero_v2_cta_wholesale")}
            </Link>
          </div>

          <nav className="premium-hero-discovery" aria-label={T("hero_quick_label")}>
            <span className="premium-hero-discovery-label">{T("hero_quick_label")}</span>
            <div className="premium-hero-discovery-links">
              {DISCOVERY_LINKS.map((item) => (
                <Link key={item.key} href={item.href}>
                  {T(item.key)}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="premium-hero-visual">
          <div className="premium-hero-visual-label" aria-hidden="true">
            <span>CURATED</span>
            <span>SEALED</span>
            <span>GLOBAL</span>
          </div>
          <HeroBrandVisual products={products} />
        </div>
      </div>

      <div className="premium-hero-facts" role="list" aria-label={T("hero_fact_label")}>
        {SERVICE_FACTS.map((fact) => (
          <div key={fact.valueKey} className="premium-hero-fact" role="listitem">
            <strong>{T(fact.valueKey)}</strong>
            <span>{T(fact.labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
