"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";
import { startSoloCheckout } from "@/lib/checkout-client";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    priceJpy: number;
    stock: number;
    images: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const T = useT();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const soldOut = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images.split(",")[0]?.trim(),
        priceJpy: product.priceJpy,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function handleBuyNow() {
    if (soldOut || buying) return;
    setBuying(true);
    setBuyError(null);
    const result = await startSoloCheckout([
      { productId: product.id, quantity },
    ]);
    if (!result.ok) {
      setBuyError(result.error);
      setBuying(false);
    }
  }

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-[14px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] py-3 font-medium text-[#9ca3af]"
      >
        {T("card_sold_out")}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-[#6b7280]">{T("btn_quantity")}</label>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(1, Math.min(product.stock, Number(e.target.value) || 1))
            )
          }
          className="input-field w-20 py-1"
        />
        <span className="text-xs text-[#9ca3af]">
          {T("btn_stock")} {product.stock}
        </span>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={handleAdd} className="btn-secondary flex-1">
          {added ? T("btn_added_cart") : T("btn_add_cart")}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={buying}
          className="btn-primary flex-1"
        >
          {buying ? T("btn_buy_loading") : T("btn_buy_now")}
        </button>
      </div>
      {buyError ? <p className="text-sm text-red-500">{buyError}</p> : null}
    </div>
  );
}
