"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatJpy } from "@/lib/format";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
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
          name={selected.name}
          soldOut={soldOut}
          soldOutLabel={T("card_sold_out")}
        />
      </div>

      <div className="product-detail-info">
        <div className="product-detail-meta">
          {product.category ? <span className="product-detail-badge">{product.category}</span> : null}
          {boxLabel ? <span className="product-detail-badge">{boxLabel}</span> : null}
          {product.isPreorder ? (
            <span className="product-detail-badge is-preorder">{T("detail_preorder")}</span>
          ) : null}
        </div>

        <h1 className="product-detail-title">{selected.name}</h1>

        {product.series ? (
          <p className="product-detail-series">
            {T("detail_series")}
            {product.series}
          </p>
        ) : null}

        {product.language ? <p className="product-detail-lang">{product.language}</p> : null}

        <p className="product-detail-price">{formatJpy(selected.priceJpy)}</p>
        <p className="product-detail-tax">{T("detail_price_tax")}</p>

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

        <div className="product-detail-shipping">
          <p className="product-detail-shipping-title">{T("detail_shipping_h")}</p>
          <ul>
            <li>
              {T("detail_shipping_1_pre")}
              {product.shippingDays}
              {T("detail_shipping_1_suf")}
            </li>
            <li>{T("detail_shipping_2")}</li>
          </ul>
        </div>

        {product.isPreorder && product.releaseDateLabel ? (
          <p className="product-detail-preorder-date">
            {T("detail_preorder_date")}
            {product.releaseDateLabel}
          </p>
        ) : null}


        <section className="rounded-[16px] border border-[rgba(17,24,39,0.08)] bg-[#fafafa] p-4 text-xs leading-relaxed text-[#6b7280]">
          <p className="font-semibold text-[#111827]">购前请确认</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>未开封盒、补充包、预售、随机/开封类商品属于特殊品类，不支持个人原因退换。</li>
            <li>卡牌开封结果、行情涨跌、轻微盒损或封膜褶皱，不作为取消、补差或售后依据。</li>
            <li>签收后 7 日内可就运输破损、错发、漏发提交订单号、面单、外箱照片和完整开箱视频。</li>
            {product.isPreorder ? <li>预售时间为预计时间；满 90 日仍未发货且订单未发货时，可按条款申请退款。</li> : null}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/terms" className="font-medium text-[#111827] hover:underline">用户协议</Link>
            <Link href="/faq#returns" className="font-medium text-[#111827] hover:underline">售后说明</Link>
            <Link href="/tokusho" className="font-medium text-[#111827] hover:underline">特定商取引法表記</Link>
          </div>
        </section>
        <div className="product-detail-cta">
          <AddToCartButton
            key={selected.id}
            product={{
              id: selected.id,
              name: selected.name,
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
      </div>
    </div>
  );
}
