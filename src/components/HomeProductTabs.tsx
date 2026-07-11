"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useT } from "@/lib/lang-context";
import type { BoxVariantOption } from "@/lib/product-box-variant-types";

type Product = React.ComponentProps<typeof ProductCard>["product"];

type TabKey = "all" | "pokemon" | "onepiece" | "psa";

type Props = {
  productsByTab: Record<TabKey, Product[]>;
  variantsByProductId?: Record<string, BoxVariantOption[]>;
};

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: "all", labelKey: "tab_all" },
  { key: "pokemon", labelKey: "tab_pokemon" },
  { key: "onepiece", labelKey: "tab_onepiece" },
  { key: "psa", labelKey: "tab_psa" },
];

export function HomeProductTabs({ productsByTab, variantsByProductId = {} }: Props) {
  const T = useT();
  const [active, setActive] = useState<TabKey>("all");
  const products = productsByTab[active];

  if (!productsByTab.all.length && !productsByTab.pokemon.length) return null;

  return (
    <section className="home-products-v2">
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
        <div className="min-w-0">
          <h2 className="section-title">{T("section_popular")}</h2>
          <p className="section-subtitle">{T("section_popular_sub")}</p>
        </div>
        <Link href="/?stock=instock" className="home-products-viewall shrink-0">
          {T("section_view_all")} →
        </Link>
      </div>

      <div className="home-tab-bar mb-7 flex gap-2 overflow-x-auto pb-1 sm:mb-8">
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
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variants={variantsByProductId[p.id]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
