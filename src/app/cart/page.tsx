"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatJpy } from "@/lib/format";
import { useLang, useT } from "@/lib/lang-context";
import { getJapanShippingRate, JAPAN_PREFECTURES } from "@/lib/shipping";
import { PAYMENT_METHODS } from "@/lib/site";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalJpy } = useCart();
  const T = useT();
  const { lang } = useLang();
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
      setError(T("cart_agree_error"));
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

      <div className="mt-5 rounded-[16px] border border-[rgba(17,24,39,0.1)] bg-white p-4">
        <p className="text-sm font-semibold text-[#111827]">{T("cart_final_title")}</p>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#6b7280]">
          <li>
            <span className="font-medium text-[#374151]">{T("cart_final_total")}：</span>
            {shipping ? formatJpy(paymentTotalJpy) : "—"}
          </li>
          <li>
            <span className="font-medium text-[#374151]">{T("cart_final_payment")}：</span>
            {PAYMENT_METHODS[lang]}
          </li>
          <li>
            <span className="font-medium text-[#374151]">{T("cart_final_shipping")}：</span>
            {T("cart_final_shipping_body")}
          </li>
          <li>
            <span className="font-medium text-[#374151]">{T("cart_final_returns")}：</span>
            {T("cart_final_returns_body")}
          </li>
        </ul>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-[16px] border border-[rgba(17,24,39,0.08)] bg-white p-4 text-xs leading-relaxed text-[#6b7280]">
        <input
          type="checkbox"
          checked={acceptedRules}
          onChange={(e) => setAcceptedRules(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-[rgba(17,24,39,0.18)]"
        />
        <span>
          {T("cart_agree_prefix")}
          <Link href="/terms" className="mx-1 font-medium text-[#111827] hover:underline">{T("cart_agree_terms")}</Link>
          <Link href="/privacy" className="mx-1 font-medium text-[#111827] hover:underline">{T("cart_agree_privacy")}</Link>
          <Link href="/tokusho" className="mx-1 font-medium text-[#111827] hover:underline">{T("cart_agree_tokusho")}</Link>
          {T("cart_agree_and")}
          <Link href="/faq#returns" className="mx-1 font-medium text-[#111827] hover:underline">{T("cart_agree_returns")}</Link>
          {T("cart_agree_suffix")}
        </span>
      </label>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button onClick={handleCheckout} disabled={loading || !acceptedRules || !shipping} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? T("cart_checkout_loading") : T("cart_checkout")}
      </button>
    </div>
  );
}
