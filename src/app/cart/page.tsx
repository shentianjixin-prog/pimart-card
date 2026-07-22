"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatJpy } from "@/lib/format";
import { useT } from "@/lib/lang-context";
import { getJapanShippingRate, JAPAN_PREFECTURES } from "@/lib/shipping";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalJpy } = useCart();
  const T = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [prefecture, setPrefecture] = useState("");
  const shipping = getJapanShippingRate(prefecture);
  const paymentTotalJpy = totalJpy + (shipping?.feeJpy ?? 0);

  async function handleCheckout() {
    if (!acceptedRules) {
      setError("请先确认并同意用户协议、隐私政策、特定商取引法表記及特殊商品售后规则。");
      return;
    }
    if (!shipping) {
      setError(T("cart_prefecture_error"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptedRules: true,
          prefecture: shipping.code,
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
        <p className="text-[#6b7280]">{T("cart_loading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-[#6b7280]">{T("cart_empty")}</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          {T("cart_go_shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{T("cart_title")}</h1>

      <div className="surface divide-y divide-[rgba(17,24,39,0.06)] overflow-hidden">
        {items.map((item) => (
          <div key={item.productId} className="cart-line-item p-4 sm:p-5">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[14px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                unoptimized={item.image?.endsWith(".svg")}
                className="object-contain p-1"
              />
            </div>
            <div className="cart-line-copy min-w-0">
              <Link href={`/products/${item.slug}`} className="text-sm font-medium text-[#111827] hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-[#6b7280]">{formatJpy(item.priceJpy)}</p>
            </div>
            <input
              aria-label={`${item.name} ${T("btn_quantity")}`}
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value) || 1)
              }
              className="input-field cart-line-quantity w-16 py-1"
            />
            <p className="cart-line-total text-right text-sm font-semibold text-[#111827]">
              {formatJpy(item.priceJpy * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="cart-line-remove text-sm text-[#6b7280] hover:text-red-500"
            >
              {T("cart_remove")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] p-5">
        <label htmlFor="shipping-prefecture" className="block text-sm font-medium text-[#111827]">
          {T("cart_prefecture_label")}
        </label>
        <select
          id="shipping-prefecture"
          value={prefecture}
          onChange={(event) => {
            setPrefecture(event.target.value);
            setError(null);
          }}
          className="input-field mt-2 w-full bg-white"
        >
          <option value="">{T("cart_prefecture_select")}</option>
          {JAPAN_PREFECTURES.map(([code, label, fee]) => (
            <option key={code} value={code}>
              {label}（{formatJpy(fee)}）
            </option>
          ))}
        </select>

        <div className="mt-5 space-y-2 border-t border-[rgba(17,24,39,0.08)] pt-4 text-sm">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span>{T("cart_subtotal")}</span>
            <span>{formatJpy(totalJpy)}</span>
          </div>
          <div className="flex items-center justify-between text-[#6b7280]">
            <span>{T("cart_shipping_fee")}</span>
            <span>{shipping ? formatJpy(shipping.feeJpy) : "—"}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(17,24,39,0.08)] pt-3 text-[#111827]">
            <span className="text-lg font-medium">{T("cart_payment_total")}</span>
            <span className="text-2xl font-bold">{shipping ? formatJpy(paymentTotalJpy) : "—"}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#6b7280]">{T("cart_shipping_note")}</p>

      <label className="mt-5 flex items-start gap-3 rounded-[16px] border border-[rgba(17,24,39,0.08)] bg-white p-4 text-xs leading-relaxed text-[#6b7280]">
        <input
          type="checkbox"
          checked={acceptedRules}
          onChange={(e) => setAcceptedRules(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-[rgba(17,24,39,0.18)]"
        />
        <span>
          我已阅读并同意
          <Link href="/terms" className="mx-1 font-medium text-[#111827] hover:underline">用户协议</Link>
          <Link href="/privacy" className="mx-1 font-medium text-[#111827] hover:underline">隐私政策</Link>
          <Link href="/tokusho" className="mx-1 font-medium text-[#111827] hover:underline">特定商取引法表記</Link>
          及
          <Link href="/faq#returns" className="mx-1 font-medium text-[#111827] hover:underline">售后规则</Link>
          。我理解未开封盒、预售、随机/开封类商品不支持个人原因退换；预售时间为预计时间，符合条款约定时可申请退款。
        </span>
      </label>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button onClick={handleCheckout} disabled={loading || !acceptedRules || !shipping} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? T("cart_checkout_loading") : T("cart_checkout")}
      </button>
    </div>
  );
}
