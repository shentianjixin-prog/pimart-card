"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatJpy } from "@/lib/format";
import { useT } from "@/lib/lang-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalJpy } = useCart();
  const T = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || T("cart_checkout_error"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(T("cart_network_error"));
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-400">{T("cart_loading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">{T("cart_empty")}</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          {T("cart_go_shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-white">{T("cart_title")}</h1>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                unoptimized={item.image?.endsWith(".svg")}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="text-sm font-medium text-white hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{formatJpy(item.priceJpy)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value) || 1)
              }
              className="input-field w-16 py-1"
            />
            <p className="w-24 text-right text-sm font-semibold text-cyan-300">
              {formatJpy(item.priceJpy * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-gray-500 hover:text-red-400"
            >
              {T("cart_remove")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-medium text-white">{T("cart_total")}</span>
        <span className="text-2xl font-bold text-cyan-300">{formatJpy(totalJpy)}</span>
      </div>

      <p className="mt-4 text-xs text-gray-500">{T("cart_shipping_note")}</p>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button onClick={handleCheckout} disabled={loading} className="btn-primary mt-6 w-full">
        {loading ? T("cart_checkout_loading") : T("cart_checkout")}
      </button>
    </div>
  );
}
