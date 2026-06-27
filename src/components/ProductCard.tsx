"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatJpy } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import { useLang } from "@/lib/lang-context";

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

const BOX_TYPE_STYLE: Record<string, string> = {
  肥盒: "bg-[#EAF4FF] text-[#1e40af]",
  瘦盒: "bg-[#F3EEFF] text-[#6d28d9]",
  宝石包: "bg-[#FFF7D6] text-[#92400e]",
  礼盒: "bg-[#FFF0F5] text-[#be185d]",
};

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    series: string | null;
    boxType: string;
    priceJpy: number;
    stock: number;
    images: string;
    isPreorder: boolean;
    createdAt: Date;
    cardNumber?: string | null;
    rarity?: string | null;
    language?: string | null;
  };
};

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { lang } = useLang();
  const T = useT();
  const [added, setAdded] = useState(false);

  const image = product.images.split(",")[0]?.trim();
  const soldOut = product.stock <= 0;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < NEW_THRESHOLD_MS;

  const metaParts = [product.cardNumber, product.rarity, product.language].filter(Boolean);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
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

  return (
    <Link href={`/products/${product.slug}`} className="product-card group relative block">
      <div className="relative aspect-[5/7] w-full overflow-hidden bg-[#f7f8fa]">
        <Image
          src={image}
          alt={product.name}
          fill
          unoptimized={image?.endsWith(".svg")}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
        />

        {isNew && !soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#111827] px-2.5 py-1 text-[10px] font-semibold text-white">
            {T("card_new")}
          </span>
        ) : BOX_TYPE_STYLE[product.boxType] ? (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${BOX_TYPE_STYLE[product.boxType]}`}>
            {translateBoxType(product.boxType, lang)}
          </span>
        ) : null}

        {product.isPreorder && (
          <span className="absolute right-3 top-3 rounded-full bg-[#FFF7D6] px-2.5 py-1 text-[10px] font-semibold text-[#92400e]">
            {T("card_preorder")}
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
            <span className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-3 py-1 text-xs font-semibold text-[#6b7280]">
              {T("card_sold_out")}
            </span>
          </div>
        )}

        {!soldOut && !product.isPreorder && (
          <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 transition-transform duration-300 sm:translate-y-full sm:group-hover:translate-y-0">
            <button onClick={handleQuickAdd} className="btn-buy rounded-full">
              {added ? T("card_added") : T("card_add_cart")}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[rgba(17,24,39,0.06)] p-4">
        <p className="line-clamp-2 text-sm font-medium text-[#111827]">{product.name}</p>
        {product.series && (
          <p className="mt-1 text-xs text-[#6b7280]">{product.series}</p>
        )}
        {metaParts.length > 0 && (
          <p className="mt-1 text-xs text-[#9ca3af]">{metaParts.join(" · ")}</p>
        )}
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-base font-semibold text-[#111827]">{formatJpy(product.priceJpy)}</p>
          {!soldOut && product.stock <= 3 && (
            <p className="text-xs font-medium text-[#92400e]">
              {T("card_remaining_pre")}{product.stock}{T("card_remaining_suf")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
