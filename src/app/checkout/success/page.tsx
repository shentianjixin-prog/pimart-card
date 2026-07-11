"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useT } from "@/lib/lang-context";

function CheckoutSuccessContent() {
  const { clear } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const solo = searchParams.get("solo") === "1";
  const T = useT();

  useEffect(() => {
    // 即刻购买不经过购物车，成功后勿清空已有购物车
    if (!solo) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-6 text-5xl">✅</div>
      <h1 className="section-title">{T("checkout_success_title")}</h1>
      {orderId && (
        <p className="mt-2 text-sm text-[#6b7280]">{T("checkout_success_order")}{orderId}</p>
      )}
      <p className="mt-4 text-sm text-[#6b7280]">{T("checkout_success_desc")}</p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        {T("checkout_success_cta")}
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
