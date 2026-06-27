"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export default function CheckoutCancelPage() {
  const T = useT();
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-6 text-5xl">❌</div>
      <h1 className="section-title">{T("checkout_cancel_title")}</h1>
      <p className="mt-4 text-sm text-[#6b7280]">{T("checkout_cancel_desc")}</p>
      <Link href="/cart" className="btn-primary mt-8 inline-flex">
        {T("checkout_cancel_cta")}
      </Link>
    </div>
  );
}
