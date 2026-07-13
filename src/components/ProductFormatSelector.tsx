"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import {
  sortBoxVariants,
  formatVariantTitle,
  firstImage,
  isPokemonPairFormat,
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

  const ordered = sortBoxVariants(variants);
  const isCsv = Boolean(series && /\bCSV\d+c\b/i.test(series));
  const isGem = series === "宝石包";
  const isOpc = Boolean(series && /^OPC-\d+/i.test(series));
  const hasPokemonPair = ordered.some((v) => isPokemonPairFormat(v.boxType));
  const currentGroup = ordered.find((v) => v.slug === currentSlug)?.boxType.startsWith("肥") ? "fat" : "slim";
  const [openGroup, setOpenGroup] = useState<"slim" | "fat">(currentGroup);

  useEffect(() => {
    setOpenGroup(currentGroup);
  }, [currentGroup]);

  const pokemonPairGroups = useMemo(() => {
    const unitOrder = ["box", "pack", "case"] as const;
    type Unit = (typeof unitOrder)[number];
    type GroupKey = "slim" | "fat";
    const unitByType: Record<string, Unit> = {
      瘦盒: "box",
      肥盒: "box",
      瘦散包: "pack",
      肥散包: "pack",
      瘦原箱: "case",
      肥原箱: "case",
    };
    const groupByType: Record<string, GroupKey> = {
      瘦盒: "slim",
      瘦散包: "slim",
      瘦原箱: "slim",
      肥盒: "fat",
      肥散包: "fat",
      肥原箱: "fat",
    };
    const base: Record<GroupKey, BoxVariantOption[]> = { slim: [], fat: [] };
    for (const variant of ordered) {
      const group = groupByType[variant.boxType];
      if (!group) continue;
      base[group].push(variant);
    }
    for (const group of Object.keys(base) as GroupKey[]) {
      base[group].sort((a, b) => unitOrder.indexOf(unitByType[a.boxType]) - unitOrder.indexOf(unitByType[b.boxType]));
    }
    return base;
  }, [ordered]);

  const useList =
    isCsv ||
    isGem ||
    isOpc ||
    ordered.some((v) => isSvExtendedFormat(v.boxType)) ||
    ordered.length >= 3;

  if (variants.length < 2) return null;

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

  if (hasPokemonPair) {
    const groups = [
      { key: "slim" as const, label: "瘦包", items: pokemonPairGroups.slim },
      { key: "fat" as const, label: "肥包", items: pokemonPairGroups.fat },
    ].filter((group) => group.items.length > 0);

    const unitLabel: Record<string, string> = {
      瘦盒: "原盒",
      肥盒: "原盒",
      瘦散包: "散包",
      肥散包: "散包",
      瘦原箱: "原箱",
      肥原箱: "原箱",
    };

    return (
      <div className="product-format">
        <p className="product-format-label">{T("detail_choose_format")}</p>
        <div className="product-format-group-list" role="listbox" aria-label={T("detail_choose_format")}>
          {groups.map((group) => {
            const expanded = openGroup === group.key;
            const activeInGroup = group.items.some((v) => v.slug === currentSlug);
            return (
              <section key={group.key} className={`product-format-group${expanded ? " is-open" : ""}${activeInGroup ? " is-active" : ""}`}>
                <button
                  type="button"
                  className="product-format-group-head"
                  onClick={() => setOpenGroup(group.key)}
                  aria-expanded={expanded}
                >
                  <span>
                    <span className="product-format-group-title">{group.label}</span>
                    <span className="product-format-group-sub">原盒 / 散包 / 原箱</span>
                  </span>
                  <span className="product-format-group-mark">{expanded ? "收起" : "选择"}</span>
                </button>

                {expanded ? (
                  <div className="product-format-group-options">
                    {group.items.map((v) => {
                      const active = v.slug === currentSlug;
                      const thumb = firstImage(v.images);
                      return (
                        <OptionShell key={v.slug} active={active} slug={v.slug} className="product-format-row product-format-row-compact">
                          <span className="product-format-thumb">
                            <Image src={thumb} alt="" width={48} height={48} className="product-format-thumb-img" />
                          </span>
                          <span className="product-format-list-main">
                            <span className="product-format-name">{unitLabel[v.boxType] ?? formatVariantTitle(v.boxType, v.name, series)}</span>
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
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
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
