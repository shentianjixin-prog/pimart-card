"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";

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
  const router = useRouter();
  const T = useT();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
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

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 py-3 font-medium text-gray-500"
      >
        {T("card_sold_out")}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">{T("btn_quantity")}</label>
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
        <span className="text-xs text-gray-500">
          {T("btn_stock")} {product.stock}
        </span>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={handleAdd} className="btn-secondary flex-1">
          {added ? T("btn_added_cart") : T("btn_add_cart")}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          className="btn-primary flex-1"
        >
          {T("btn_buy_now")}
        </button>
      </div>
    </div>
  );
}
