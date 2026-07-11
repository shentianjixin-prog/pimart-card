"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import {
  sortBoxVariants,
  formatVariantTitle,
  firstImage,
  isSvExtendedFormat,
  type BoxVariantOption,
} from "@/lib/product-box-variant-types";
import { formatJpy } from "@/lib/format";

export function ProductFormatSelector({
  variants,
  currentSlug,
  series,
}: {
  variants: BoxVariantOption[];
  currentSlug: string;
  series?: string | null;
}) {
  const T = useT();
  const { lang } = useLang();

  if (variants.length < 2) return null;

  const ordered = sortBoxVariants(variants);
  const isCsv = Boolean(series && /\bCSV\d+c\b/i.test(series));
  const useList = isCsv || ordered.some((v) => isSvExtendedFormat(v.boxType)) || ordered.length >= 4;

  if (useList) {
    return (
      <div className="product-format">
        <p className="product-format-label">{T("detail_choose_format")}</p>
        <div className="product-format-list" role="listbox" aria-label={T("detail_choose_format")}>
          {ordered.map((v) => {
            const active = v.slug === currentSlug;
            const title = isCsv
              ? formatVariantTitle(v.boxType, v.name, series)
              : translateBoxType(v.boxType, lang);
            const thumb = firstImage(v.images);
            const inner = (
              <>
                <span className="product-format-thumb">
                  <Image src={thumb} alt="" width={48} height={48} className="product-format-thumb-img" />
                </span>
                <span className="product-format-list-main">
                  <span className="product-format-name">{title}</span>
                  {v.stock <= 0 ? (
                    <span className="product-format-stock is-out">{T("card_sold_out")}</span>
                  ) : (
                    <span className="product-format-stock">
                      {T("btn_stock")} {v.stock}
                    </span>
                  )}
                </span>
                <span className="product-format-price">{formatJpy(v.priceJpy)}</span>
              </>
            );

            if (active) {
              return (
                <div
                  key={v.slug}
                  role="option"
                  aria-selected="true"
                  className="product-format-row is-active"
                >
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={v.slug}
                href={`/products/${encodeURIComponent(v.slug)}`}
                role="option"
                aria-selected="false"
                className="product-format-row"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const cols = Math.min(ordered.length, 3);

  return (
    <div className="product-format">
      <p className="product-format-label">{T("detail_choose_format")}</p>
      <div
        className="product-format-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
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
            <Link
              key={v.slug}
              href={`/products/${encodeURIComponent(v.slug)}`}
              className="product-format-option"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
