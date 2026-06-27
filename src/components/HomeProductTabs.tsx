"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useT } from "@/lib/lang-context";

type Product = React.ComponentProps<typeof ProductCard>["product"];

type TabKey = "all" | "pokemon" | "onepiece" | "psa";

type Props = {
  productsByTab: Record<TabKey, Product[]>;
};

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: "all", labelKey: "tab_all" },
  { key: "pokemon", labelKey: "tab_pokemon" },
  { key: "onepiece", labelKey: "tab_onepiece" },
  { key: "psa", labelKey: "tab_psa" },
];

export function HomeProductTabs({ productsByTab }: Props) {
  const T = useT();
  const [active, setActive] = useState<TabKey>("all");
  const products = productsByTab[active];

  if (!productsByTab.all.length && !productsByTab.pokemon.length) return null;

  return (
    <section className="home-products-v2 py-10 sm:py-14 lg:py-16">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">{T("section_popular")}</h2>
          <p className="section-subtitle">{T("home_latest_arrivals")}</p>
        </div>
        <Link
          href="/?stock=instock"
          className="text-sm font-medium text-[#374151] transition hover:text-[#111827]"
        >
          {T("section_view_all")} →
        </Link>
      </div>

      <div className="home-tab-bar mb-8 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`home-tab-pill min-h-11 shrink-0 ${active === tab.key ? "is-active" : ""}`}
          >
            {T(tab.labelKey)}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#9ca3af]">{T("page_no_products")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
