"use client";

import Link from "next/link";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import type { BoxVariantOption } from "@/lib/product-box-variants";
import { formatJpy } from "@/lib/format";

export function ProductFormatSelector({
  variants,
  currentSlug,
}: {
  variants: BoxVariantOption[];
  currentSlug: string;
}) {
  const T = useT();
  const { lang } = useLang();

  if (variants.length < 2) return null;

  const ordered = [...variants].sort((a, b) => {
    const rank = (t: string) => (t === "肥盒" ? 0 : 1);
    return rank(a.boxType) - rank(b.boxType);
  });

  return (
    <div className="product-format">
      <p className="product-format-label">{T("detail_choose_format")}</p>
      <div className="product-format-grid">
        {ordered.map((v) => {
          const active = v.slug === currentSlug;
          const label = translateBoxType(v.boxType, lang);
          const inner = (
            <>
              <span className="product-format-name">{label}</span>
              <span className="product-format-price">{formatJpy(v.priceJpy)}</span>
              {v.stock <= 0 ? (
                <span className="product-format-stock is-out">{T("card_sold_out")}</span>
              ) : (
                <span className="product-format-stock">
                  {T("btn_stock")} {v.stock}
                </span>
              )}
            </>
          );

          if (active) {
            return (
              <div key={v.slug} className="product-format-option is-active" aria-current="true">
                {inner}
              </div>
            );
          }

          return (
            <Link key={v.slug} href={`/products/${encodeURIComponent(v.slug)}`} className="product-format-option">
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
