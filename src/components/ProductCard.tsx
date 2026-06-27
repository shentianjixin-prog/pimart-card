"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatJpy } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import { useLang } from "@/lib/lang-context";

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

const BOX_TYPE_STYLE: Record<string, string> = {
  肥盒: "border border-white/20 bg-white/10 text-white",
  瘦盒: "border border-white/20 bg-white/10 text-neutral-300",
  宝石包: "border border-white/20 bg-white/10 text-neutral-300",
  礼盒: "border border-white/20 bg-white/10 text-neutral-300",
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
  };
};

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { lang } = useLang();
  const T = useT();
  const [added, setAdded] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const image = product.images.split(",")[0]?.trim();
  const soldOut = product.stock <= 0;

  useEffect(() => {
    setIsNew(
      Date.now() - new Date(product.createdAt).getTime() < NEW_THRESHOLD_MS
    );
  }, [product.createdAt]);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    <Link
      href={`/products/${product.slug}`}
      className="group surface relative block overflow-hidden transition hover:border-white/25"
    >
      <div className="relative aspect-[5/7] w-full overflow-hidden bg-white/[0.02]">
        <Image
          src={image}
          alt={product.name}
          fill
          unoptimized={image?.endsWith(".svg")}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain transition group-hover:scale-105"
        />

        {isNew && !soldOut ? (
          <span className="absolute left-2 top-2 rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {T("card_new")}
          </span>
        ) : BOX_TYPE_STYLE[product.boxType] ? (
          <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${BOX_TYPE_STYLE[product.boxType]}`}>
            {translateBoxType(product.boxType, lang)}
          </span>
        ) : null}

        {product.isPreorder && (
          <span className="absolute right-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
            {T("card_preorder")}
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
              {T("card_sold_out")}
            </span>
          </div>
        )}

        {/* 移动端常显；桌面端 hover 滑出 */}
        {!soldOut && !product.isPreorder && (
          <div className="absolute inset-x-0 bottom-0 translate-y-0 transition-transform duration-200 sm:translate-y-full sm:group-hover:translate-y-0">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-buy"
            >
              {added ? T("card_added") : T("card_add_cart")}
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-white">{product.name}</p>
        {product.series && (
          <p className="mt-1 text-xs text-gray-500">{product.series}</p>
        )}
        <div className="mt-2 flex items-end justify-between">
          <p className="text-base font-bold text-white">{formatJpy(product.priceJpy)}</p>
          {!soldOut && product.stock <= 3 && (
            <p className="text-xs font-medium text-orange-400">
              {T("card_remaining_pre")}{product.stock}{T("card_remaining_suf")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
