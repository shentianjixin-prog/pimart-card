"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatProductPrice } from "@/lib/format";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import {
  localizeCategory,
  localizeDescription,
  localizeLanguageLabel,
  localizeProductName,
  localizeSeries,
} from "@/lib/product-i18n";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductFormatSelector } from "@/components/ProductFormatSelector";
import {
  sortBoxVariants,
  type BoxVariantOption,
} from "@/lib/product-box-variant-types";

export type DetailProduct = {
  id: string;
  slug: string;
  name: string;
  series: string | null;
  language: string | null;
  category: string | null;
  boxType: string;
  priceJpy: number;
  stock: number;
  images: string;
  isPreorder: boolean;
  shippingDays: number;
  description: string | null;
  releaseDateLabel: string | null;
};

type Props = {
  product: DetailProduct;
  variants: BoxVariantOption[];
  children?: React.ReactNode;
};

export function ProductDetailPurchase({ product, variants, children }: Props) {
  const T = useT();
  const { lang } = useLang();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const ordered = useMemo(() => {
    const list = variants.length > 0 ? variants : [];
    const hasCurrent = list.some((v) => v.slug === product.slug);
    const seed = hasCurrent
      ? list
      : [
          {
            id: product.id,
            slug: product.slug,
            boxType: product.boxType,
            name: product.name,
            priceJpy: product.priceJpy,
            stock: product.stock,
            images: product.images,
          },
          ...list,
        ];
    return sortBoxVariants(seed);
  }, [variants, product]);

  const [selectedSlug, setSelectedSlug] = useState(product.slug);

  useEffect(() => {
    setSelectedSlug(product.slug);
  }, [product.slug]);

  const selected =
    ordered.find((v) => v.slug === selectedSlug) ??
    ordered.find((v) => v.slug === product.slug) ??
    ordered[0];

  if (!selected) return null;

  const soldOut = selected.stock <= 0;
  const boxLabel = selected.boxType ? translateBoxType(selected.boxType, lang) : "";
  const displayName = localizeProductName(selected.name, lang);
  const displaySeries = localizeSeries(product.series, lang);
  const displayLanguage = localizeLanguageLabel(product.language, lang, product.name);
  const displayCategory = localizeCategory(product.category, lang);
  const displayDescription = localizeDescription(product.description, lang);

  function selectVariant(slug: string) {
    if (slug === selectedSlug) return;
    setSelectedSlug(slug);
    // 只改 URL，不滚动、不整页跳动
    startTransition(() => {
      router.replace(`/products/${encodeURIComponent(slug)}`, { scroll: false });
    });
  }

  return (
    <div className="product-detail-layout">
      <div className="product-detail-media">
        <ProductImageGallery
          key={selected.slug}
          images={selected.images}
          name={displayName}
          soldOut={soldOut}
          soldOutLabel={T("card_sold_out")}
        />
      </div>

      <div className="product-detail-info">
        <div className="product-detail-meta">
          {displayCategory ? <span className="product-detail-badge">{displayCategory}</span> : null}
          {boxLabel ? <span className="product-detail-badge">{boxLabel}</span> : null}
          {product.isPreorder ? (
            <span className="product-detail-badge is-preorder">{T("detail_preorder")}</span>
          ) : null}
        </div>

        <h1 className="product-detail-title">{displayName}</h1>

        {displaySeries ? (
          <p className="product-detail-series">
            {T("detail_series")}
            {displaySeries}
          </p>
        ) : null}

        {displayLanguage !== "—" ? <p className="product-detail-lang">{displayLanguage}</p> : null}

        <p className="product-detail-price">{formatProductPrice(selected.priceJpy, T("price_pending"))}</p>
        {selected.priceJpy > 0 ? <p className="product-detail-tax">{T("detail_price_tax")}</p> : null}

        {!soldOut && selected.stock <= 3 ? (
          <p className="product-detail-lowstock">
            {T("detail_remaining_pre")}
            {selected.stock}
            {T("detail_remaining_suf")}
          </p>
        ) : null}

        <ProductFormatSelector
          variants={ordered}
          currentSlug={selected.slug}
          series={product.series}
          onSelect={selectVariant}
        />

        <section className="product-detail-shipping" aria-label={T("detail_shipping_h")}>
          <div className="product-detail-shipping-head">
            <p className="product-detail-shipping-title">
              <span className="product-detail-shipping-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 7.25 12 3l8.5 4.25v9.5L12 21l-8.5-4.25v-9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="m3.75 7.5 8.25 4.1 8.25-4.1M12 11.6V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m8 5.25 8.25 4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              {T("detail_shipping_h")}
            </p>
            <span className="product-detail-shipping-badge">
              {product.isPreorder ? T("detail_badge_preorder") : T("detail_badge_instock")}
            </span>
          </div>
          <div className="product-detail-shipping-grid">
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">{T("detail_ship_eta_k")}</span>
              <span className="product-detail-shipping-v">
                {T("detail_ship_eta_v_pre")}
                {product.shippingDays}
                {T("detail_ship_eta_v_suf")}
              </span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">{T("detail_ship_notify_k")}</span>
              <span className="product-detail-shipping-v">{T("detail_ship_notify_v")}</span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">{T("detail_ship_merge_k")}</span>
              <span className="product-detail-shipping-v">{T("detail_ship_merge_v")}</span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">{T("detail_ship_sign_k")}</span>
              <span className="product-detail-shipping-v">{T("product_shipping_evidence")}</span>
            </div>
          </div>
        </section>

        {product.isPreorder && product.releaseDateLabel ? (
          <p className="product-detail-preorder-date">
            {T("detail_preorder_date")}
            {product.releaseDateLabel}
          </p>
        ) : null}

        <section className="rounded-[16px] border border-[rgba(17,24,39,0.08)] bg-[#fafafa] p-4 text-xs leading-relaxed text-[#6b7280]">
          <p className="font-semibold text-[#111827]">{T("detail_confirm_h")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>{T("detail_confirm_1")}</li>
            <li>{T("detail_confirm_2")}</li>
            <li>{T("product_returns_hint")}</li>
            {product.isPreorder ? <li>{T("detail_confirm_preorder")}</li> : null}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/terms" className="font-medium text-[#111827] hover:underline">
              {T("detail_link_terms")}
            </Link>
            <Link href="/faq#returns" className="font-medium text-[#111827] hover:underline">
              {T("detail_link_faq")}
            </Link>
            <Link href="/tokusho" className="font-medium text-[#111827] hover:underline">
              {T("detail_link_tokusho")}
            </Link>
          </div>
        </section>
        <div className="product-detail-cta">
          <AddToCartButton
            key={selected.id}
            product={{
              id: selected.id,
              name: displayName,
              slug: selected.slug,
              series: product.series,
              boxType: selected.boxType,
              priceJpy: selected.priceJpy,
              stock: selected.stock,
              images: selected.images,
            }}
            variants={ordered}
          />
        </div>

        {children}

        {displayDescription ? (
          <div className="product-detail-desc mt-6">
            <p className="product-detail-desc-title">{T("detail_description")}</p>
            <p className="whitespace-pre-line">{displayDescription}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
