"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatJpy } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useLang, useT } from "@/lib/lang-context";
import { translateBoxType } from "@/lib/translations";
import { startSoloCheckout } from "@/lib/checkout-client";
import {
  sortBoxVariants,
  formatVariantTitle,
  firstImage,
  isSvExtendedFormat,
  type BoxVariantOption,
} from "@/lib/product-box-variant-types";

export type BuySheetProduct = {
  id: string;
  slug: string;
  name: string;
  series: string | null;
  boxType: string;
  priceJpy: number;
  stock: number;
  images: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: BuySheetProduct;
  variants?: BoxVariantOption[];
};

export function ProductBuySheet({ open, onClose, product, variants = [] }: Props) {
  const { addItem } = useCart();
  const T = useT();
  const { lang } = useLang();
  const ordered = sortBoxVariants(variants);
  const hasFormats = ordered.length >= 2;

  const [selectedId, setSelectedId] = useState(product.id);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedId(product.id);
    setQuantity(1);
    setBuying(false);
    setAdded(false);
    setError(null);
  }, [open, product.id]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

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

  const thumb = firstImage(active.images);
  const soldOut = active.stock <= 0;
  const maxQty = Math.max(1, active.stock);
  const qty = Math.min(quantity, maxQty);
  const useListTitles =
    Boolean(product.series && /\bCSV\d+c\b/i.test(product.series)) ||
    ordered.some((v) => isSvExtendedFormat(v.boxType)) ||
    ordered.length >= 4 ||
    product.series === "宝石包";

  function handleAdd() {
    if (soldOut) return;
    addItem(
      {
        productId: active.id,
        name: active.name,
        slug: active.slug,
        image: thumb,
        priceJpy: active.priceJpy,
        stock: active.stock,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  async function handleBuy() {
    if (soldOut || buying) return;
    setBuying(true);
    setError(null);
    const result = await startSoloCheckout([{ productId: active.id, quantity: qty }]);
    if (!result.ok) {
      setError(result.error);
      setBuying(false);
    }
  }

  return (
    <div className="buy-sheet-root" role="dialog" aria-modal="true" aria-label={T("btn_buy_now")}>
      <button type="button" className="buy-sheet-backdrop" aria-label="关闭" onClick={onClose} />
      <div className="buy-sheet-panel">
        <div className="buy-sheet-header">
          <div className="buy-sheet-hero">
            <span className="buy-sheet-thumb">
              <Image src={thumb} alt="" width={72} height={72} className="buy-sheet-thumb-img" />
            </span>
            <div className="buy-sheet-hero-main">
              <p className="buy-sheet-price">{formatJpy(active.priceJpy)}</p>
              <p className="buy-sheet-stock">
                {soldOut ? T("card_sold_out") : `${T("btn_stock")} ${active.stock}`}
              </p>
              <p className="buy-sheet-name">{active.name}</p>
            </div>
          </div>
          <button type="button" className="buy-sheet-close" onClick={onClose} aria-label="×">
            ×
          </button>
        </div>

        <div className="buy-sheet-body">
          {hasFormats ? (
            <div className="buy-sheet-formats">
              <p className="buy-sheet-label">{T("detail_choose_format")}</p>
              <div className="product-format-list" role="listbox" aria-label={T("detail_choose_format")}>
                {ordered.map((v) => {
                  const activeFmt = v.id === active.id;
                  const title = useListTitles
                    ? formatVariantTitle(v.boxType, v.name, product.series)
                    : translateBoxType(v.boxType, lang);
                  const out = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="option"
                      aria-selected={activeFmt}
                      disabled={out && !activeFmt}
                      onClick={() => {
                        setSelectedId(v.id);
                        setQuantity(1);
                        setError(null);
                      }}
                      className={`product-format-row${activeFmt ? " is-active" : ""}${out ? " is-out" : ""}`}
                    >
                      <span className="product-format-thumb">
                        <Image
                          src={firstImage(v.images)}
                          alt=""
                          width={48}
                          height={48}
                          className="product-format-thumb-img"
                        />
                      </span>
                      <span className="product-format-list-main">
                        <span className="product-format-name">{title}</span>
                        {out ? (
                          <span className="product-format-stock is-out">{T("card_sold_out")}</span>
                        ) : (
                          <span className="product-format-stock">
                            {T("btn_stock")} {v.stock}
                          </span>
                        )}
                      </span>
                      <span className="product-format-price">{formatJpy(v.priceJpy)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="buy-sheet-qty">
            <p className="buy-sheet-label">{T("btn_quantity")}</p>
            <div className="buy-sheet-stepper">
              <button
                type="button"
                className="buy-sheet-step"
                disabled={qty <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="buy-sheet-qty-value">{qty}</span>
              <button
                type="button"
                className="buy-sheet-step"
                disabled={soldOut || qty >= maxQty}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="buy-sheet-footer">
          {error ? <p className="buy-sheet-error">{error}</p> : null}
          <div className="buy-sheet-actions">
            <button type="button" className="btn-secondary" disabled={soldOut} onClick={handleAdd}>
              {added ? T("btn_added_cart") : T("btn_add_cart")}
            </button>
            <button type="button" className="btn-buy" disabled={soldOut || buying} onClick={handleBuy}>
              {buying ? T("btn_buy_loading") : T("btn_buy_now")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
