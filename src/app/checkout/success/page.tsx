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
  const T = useT();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-6 text-5xl">✅</div>
      <h1 className="text-2xl font-bold text-white">{T("checkout_success_title")}</h1>
      {orderId && (
        <p className="mt-2 text-sm text-gray-500">{T("checkout_success_order")}{orderId}</p>
      )}
      <p className="mt-4 text-sm text-gray-500">{T("checkout_success_desc")}</p>
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
