"use client";

import Image from "next/image";
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
  onSelect,
}: {
  variants: BoxVariantOption[];
  currentSlug: string;
  series?: string | null;
  /** 有回调时原地切换，不再整页跳转 */
  onSelect?: (slug: string) => void;
}) {
  const T = useT();
  const { lang } = useLang();

  if (variants.length < 2) return null;

  const ordered = sortBoxVariants(variants);
  const isCsv = Boolean(series && /\bCSV\d+c\b/i.test(series));
  const isGem = series === "宝石包";
  const isOpc = Boolean(series && /^OPC-\d+/i.test(series));
  const useList =
    isCsv ||
    isGem ||
    isOpc ||
    ordered.some((v) => isSvExtendedFormat(v.boxType)) ||
    ordered.length >= 3;

  function OptionShell({
    active,
    slug,
    className,
    children,
  }: {
    active: boolean;
    slug: string;
    className: string;
    children: React.ReactNode;
  }) {
    if (active) {
      return (
        <div role="option" aria-selected="true" className={`${className} is-active`}>
          {children}
        </div>
      );
    }

    if (onSelect) {
      return (
        <button
          type="button"
          role="option"
          aria-selected="false"
          className={className}
          onClick={() => onSelect(slug)}
        >
          {children}
        </button>
      );
    }

    return (
      <a href={`/products/${encodeURIComponent(slug)}`} role="option" aria-selected="false" className={className}>
        {children}
      </a>
    );
  }

  if (useList) {
    return (
      <div className="product-format">
        <p className="product-format-label">{T("detail_choose_format")}</p>
        <div className="product-format-list" role="listbox" aria-label={T("detail_choose_format")}>
          {ordered.map((v) => {
            const active = v.slug === currentSlug;
            const title =
              isCsv || isGem || isSvExtendedFormat(v.boxType)
                ? formatVariantTitle(v.boxType, v.name, series)
                : translateBoxType(v.boxType, lang);
            const thumb = firstImage(v.images);
            return (
              <OptionShell key={v.slug} active={active} slug={v.slug} className="product-format-row">
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
              </OptionShell>
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
          return (
            <OptionShell
              key={v.slug}
              active={active}
              slug={v.slug}
              className="product-format-option"
            >
              <span className="product-format-name">{label}</span>
              <span className="product-format-price">{formatJpy(v.priceJpy)}</span>
              {v.stock <= 0 ? (
                <span className="product-format-stock is-out">{T("card_sold_out")}</span>
              ) : (
                <span className="product-format-stock">
                  {T("btn_stock")} {v.stock}
                </span>
              )}
            </OptionShell>
          );
        })}
      </div>
    </div>
  );
}
