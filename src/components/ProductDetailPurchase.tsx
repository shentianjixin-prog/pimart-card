"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatProductPrice } from "@/lib/format";
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

        <section className="product-detail-shipping" aria-label="发货说明">
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
              {product.isPreorder ? "预售/调货商品" : "现货商品"}
            </span>
          </div>
          <div className="product-detail-shipping-grid">
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">预计发货</span>
              <span className="product-detail-shipping-v">
                下单付款后 {product.shippingDays} 个工作日内安排发出
              </span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">通知方式</span>
              <span className="product-detail-shipping-v">发货后将通过邮件同步物流信息</span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">合单规则</span>
              <span className="product-detail-shipping-v">同一订单含预售或调货商品时，可能等待齐货后统一发出</span>
            </div>
            <div className="product-detail-shipping-item">
              <span className="product-detail-shipping-k">签收提醒</span>
              <span className="product-detail-shipping-v">签收前请检查外箱，异常请保留面单、外箱照片和完整开箱视频</span>
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
