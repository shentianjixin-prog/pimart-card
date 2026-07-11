"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatJpy } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import { CardPlaceholder, isUsableProductImage } from "@/components/HeroPlaceholders";
import { startSoloCheckout } from "@/lib/checkout-client";
import { sortBoxVariants, type BoxVariantOption } from "@/lib/product-box-variant-types";

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

type ProductData = {
  id: string;
  slug: string;
  name: string;
  series: string | null;
  boxType: string;
  priceJpy: number;
  stock: number;
  images: string;
  isPreorder: boolean;
  featured?: boolean;
  createdAt: Date;
  cardNumber?: string | null;
  rarity?: string | null;
  language?: string | null;
};

type Props = {
  product: ProductData;
  /** 可切换规格（原盒/散包/原箱 或 肥盒/瘦盒）；少于 2 个不展示 */
  variants?: BoxVariantOption[];
};

function isPsaProduct(product: ProductData) {
  const haystack = [product.name, product.series, product.cardNumber, product.rarity]
    .filter(Boolean)
    .join(" ");
  return /psa/i.test(haystack);
}

function isWholesaleProduct(product: ProductData) {
  const haystack = `${product.name} ${product.series ?? ""}`;
  return /wholesale|批发|卸売|b2b/i.test(haystack);
}

export function ProductCard({ product, variants = [] }: Props) {
  const { addItem } = useCart();
  const T = useT();
  const { lang } = useLang();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(product.id);
  const [imgFailed, setImgFailed] = useState(false);

  const ordered = sortBoxVariants(variants);
  const showFormats = ordered.length >= 2;
  const selected =
    ordered.find((v) => v.id === selectedId) ??
    ordered.find((v) => v.id === product.id) ??
    null;

  const active = selected
    ? {
        id: selected.id,
        slug: selected.slug,
        name: selected.name,
        priceJpy: selected.priceJpy,
        stock: selected.stock,
        images: selected.images,
        boxType: selected.boxType,
      }
    : {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceJpy: product.priceJpy,
        stock: product.stock,
        images: product.images,
        boxType: product.boxType,
      };

  const image = active.images.split(",")[0]?.trim();
  const showPlaceholder = !isUsableProductImage(image) || imgFailed;
  const soldOut = active.stock <= 0;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < NEW_THRESHOLD_MS;
  const isHot = product.featured === true;
  const isPsa = isPsaProduct(product);
  const isWholesale = isWholesaleProduct(product);

  const stockLabel = soldOut
    ? T("card_sold_out")
    : product.isPreorder
      ? T("card_preorder")
      : T("filter_instock");

  function selectFormat(variant: BoxVariantOption) {
    setSelectedId(variant.id);
    setImgFailed(false);
    setBuyError(null);
  }

  function addToCart() {
    addItem({
      productId: active.id,
      name: active.name,
      slug: active.slug,
      image,
      priceJpy: active.priceJpy,
      stock: active.stock,
    });
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || buying) return;
    setBuying(true);
    setBuyError(null);
    const result = await startSoloCheckout([{ productId: active.id, quantity: 1 }]);
    if (!result.ok) {
      setBuyError(result.error);
      setBuying(false);
    }
  }

  const tagItems: { label: string; className: string }[] = [];
  if (isNew && !soldOut) tagItems.push({ label: T("card_new"), className: "bg-[#111827] text-white" });
  if (isHot) tagItems.push({ label: T("card_hot"), className: "bg-[#FFF7D6] text-[#92400e]" });
  if (isPsa) tagItems.push({ label: T("card_psa"), className: "bg-[#FFF0F5] text-[#be185d]" });
  if (isWholesale) tagItems.push({ label: T("card_wholesale"), className: "bg-[#F3EEFF] text-[#6d28d9]" });

  return (
    <div className="product-card group flex h-full flex-col">
      <Link href={`/products/${encodeURIComponent(active.slug)}`} className="block flex-1">
        <div className="relative aspect-[5/7] w-full overflow-hidden bg-[#FAFAFA]">
          {showPlaceholder ? (
            <CardPlaceholder className="h-full rounded-none" />
          ) : (
            <Image
              key={active.id}
              src={image}
              alt={active.name}
              fill
              unoptimized={image?.endsWith(".svg") || image?.endsWith(".webp")}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
              onError={() => setImgFailed(true)}
            />
          )}

          {tagItems.length > 0 && (
            <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1">
              {tagItems.slice(0, 3).map((tag) => (
                <span
                  key={tag.label}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tag.className}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
              <span className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-3 py-1 text-xs font-semibold text-[#6b7280]">
                {T("card_sold_out")}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[rgba(17,24,39,0.06)] p-3 sm:p-4">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-[#111827]">
            {active.name}
          </p>

          <dl className="product-card-meta mt-2.5 text-[11px] text-[#6b7280] sm:mt-3">
            <div className="product-card-meta-row">
              <dt className="shrink-0 text-[#9ca3af]">{T("card_label_language")}</dt>
              <dd className="truncate text-[#374151]">{product.language || "—"}</dd>
            </div>
            {product.series && (
              <div className="product-card-meta-row product-card-meta-series">
                <dt className="shrink-0 text-[#9ca3af]">{T("card_label_series")}</dt>
                <dd className="truncate text-[#374151]">{product.series}</dd>
              </div>
            )}
            <div className="product-card-meta-row">
              <dt className="shrink-0 text-[#9ca3af]">{T("card_label_stock")}</dt>
              <dd className={soldOut ? "text-[#9ca3af]" : active.stock <= 3 ? "font-medium text-[#92400e]" : "text-emerald-700"}>
                {stockLabel}
                {!soldOut && active.stock <= 3 && (
                  <span className="ml-1 text-[#92400e]">
                    ({T("card_remaining_pre")}{active.stock}{T("card_remaining_suf")})
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-end justify-between gap-2">
            <p className="text-lg font-semibold tracking-tight text-[#111827]">{formatJpy(active.priceJpy)}</p>
          </div>
        </div>
      </Link>

      {showFormats ? (
        <div className="product-card-formats px-3 sm:px-4">
          <p className="product-card-formats-label">{T("detail_choose_format")}</p>
          <div className="product-card-format-row" role="listbox" aria-label={T("detail_choose_format")}>
            {ordered.map((v) => {
              const activeFmt = v.id === active.id;
              const out = v.stock <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="option"
                  aria-selected={activeFmt}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectFormat(v);
                  }}
                  className={`product-card-format-chip${activeFmt ? " is-active" : ""}${out ? " is-out" : ""}`}
                >
                  <span className="product-card-format-name">{translateBoxType(v.boxType, lang)}</span>
                  <span className="product-card-format-price">{formatJpy(v.priceJpy)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="product-card-actions border-t border-[rgba(17,24,39,0.06)] px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        {soldOut ? (
          <button type="button" disabled className="btn-buy min-h-11 rounded-full text-sm">
            {T("card_sold_out")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-secondary product-card-btn min-h-11 flex-1 rounded-full px-2 text-xs sm:text-sm"
            >
              {added ? T("card_added") : T("btn_add_cart")}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={buying}
              className="btn-buy product-card-btn min-h-11 flex-1 rounded-full px-2 text-xs sm:text-sm"
            >
              {buying ? T("btn_buy_loading") : T("btn_buy_now")}
            </button>
          </>
        )}
      </div>
      {buyError ? (
        <p className="px-3 pb-2 text-[11px] text-red-500 sm:px-4">{buyError}</p>
      ) : null}
    </div>
  );
}
