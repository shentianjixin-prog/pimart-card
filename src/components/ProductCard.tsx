"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatProductPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";
import { CardPlaceholder, isUsableProductImage } from "@/components/HeroPlaceholders";

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

export function ProductCard({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const T = useT();
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const image = product.images.split(",")[0]?.trim();
  const showPlaceholder = !isUsableProductImage(image) || imgFailed;
  const soldOut = product.stock <= 0;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < NEW_THRESHOLD_MS;
  const isHot = product.featured === true;
  const isPsa = isPsaProduct(product);
  const isWholesale = isWholesaleProduct(product);
  const productHref = `/products/${encodeURIComponent(product.slug)}`;

  const stockLabel = soldOut
    ? T("card_sold_out")
    : product.isPreorder
      ? T("card_preorder")
      : T("filter_instock");

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      priceJpy: product.priceJpy,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    router.push(productHref);
  }

  const tagItems: { label: string; className: string }[] = [];
  if (isNew && !soldOut) tagItems.push({ label: T("card_new"), className: "bg-[#111827] text-white" });
  if (isHot) tagItems.push({ label: T("card_hot"), className: "bg-[#FFF7D6] text-[#92400e]" });
  if (isPsa) tagItems.push({ label: T("card_psa"), className: "bg-[#FFF0F5] text-[#be185d]" });
  if (isWholesale) tagItems.push({ label: T("card_wholesale"), className: "bg-[#F3EEFF] text-[#6d28d9]" });

  return (
    <div className="product-card group flex h-full flex-col">
      <Link href={productHref} className="block flex-1">
        <div className="relative aspect-[5/7] w-full overflow-hidden bg-[#FAFAFA]">
          {showPlaceholder ? (
            <CardPlaceholder className="h-full rounded-none" />
          ) : (
            <Image
              src={image}
              alt={product.name}
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
            {product.name}
          </p>

          <dl className="product-card-meta mt-2.5 text-[11px] text-[#6b7280] sm:mt-3">
            <div className="product-card-meta-row">
              <dt className="shrink-0 text-[#9ca3af]">{T("card_label_language")}</dt>
              <dd className="truncate text-[#374151]">
                {product.language?.trim() ||
                  (product.name.includes("简中") ? "简中" : product.name.includes("日版") || product.name.includes("日文") ? "日文" : "—")}
              </dd>
            </div>
            {product.series && (
              <div className="product-card-meta-row product-card-meta-series">
                <dt className="shrink-0 text-[#9ca3af]">{T("card_label_series")}</dt>
                <dd className="truncate text-[#374151]">{product.series}</dd>
              </div>
            )}
            <div className="product-card-meta-row">
              <dt className="shrink-0 text-[#9ca3af]">{T("card_label_stock")}</dt>
              <dd
                className={
                  soldOut
                    ? "text-[#9ca3af]"
                    : product.stock <= 3
                      ? "font-medium text-[#92400e]"
                      : "text-emerald-700"
                }
              >
                {stockLabel}
                {!soldOut && product.stock <= 3 && (
                  <span className="ml-1 text-[#92400e]">
                    ({T("card_remaining_pre")}
                    {product.stock}
                    {T("card_remaining_suf")})
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-end justify-between gap-2">
            <p className="text-lg font-semibold tracking-tight text-[#111827]">
              {formatProductPrice(product.priceJpy, T("price_pending"))}
            </p>
          </div>
        </div>
      </Link>

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
              className="btn-buy product-card-btn min-h-11 flex-1 rounded-full px-2 text-xs sm:text-sm"
            >
              {T("btn_buy_now")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
