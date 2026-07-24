"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AFTER_SALES_ISSUE_TYPES,
  AfterSalesApplySheet,
  type AfterSalesIssueType,
} from "@/components/AfterSalesApplySheet";
import { useLang, useT } from "@/lib/lang-context";

const EVIDENCE = {
  zh: [
    "订单号、注册邮箱和物流单号",
    "外箱六面照片、物流面单照片、内包装照片",
    "从未开封外箱开始连续拍摄到取出商品的开箱视频，或同等连续照片",
    "问题位置的清晰照片或视频",
    "请在处理完成前保留外箱、面单、缓冲材料和商品原状态",
  ],
  ja: [
    "注文番号・登録メール・追跡番号",
    "外箱六面・伝票・内装の写真",
    "未開封外箱から取出まで連続撮影した開封動画、または同等の連続写真",
    "不具合箇所の鮮明な写真または動画",
    "対応完了まで外箱・伝票・緩衝材・商品状態を保管",
  ],
  en: [
    "Order number, account email and tracking number",
    "Six-side outer box, label and inner packaging photos",
    "Continuous unboxing video from sealed outer box to unpacked item, or equivalent continuous photos",
    "Clear photos or video of the defect area",
    "Keep box, label, cushioning and item as-is until resolved",
  ],
} as const;

const COPY = {
  zh: { types: "可选问题类型", typesHint: "点击类型即可开始申请", evidence: "建议准备的证据", rules: "查看售后规则" },
  ja: { types: "問題タイプ", typesHint: "タイプを選んで申請を開始", evidence: "推奨証拠", rules: "アフタールールを見る" },
  en: { types: "Issue types", typesHint: "Tap a type to start", evidence: "Recommended evidence", rules: "View after-sales rules" },
} as const;

export function AfterSalesPageClient() {
  const T = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [initialIssueType, setInitialIssueType] = useState<AfterSalesIssueType | "">("");
  const copy = COPY[lang];

  function openApply(issueType: AfterSalesIssueType | "" = "") {
    setInitialIssueType(issueType);
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">After-sales</p>
          <h1 className="section-title mt-2">{T("aftersales_title")}</h1>
        </div>
        <Link href="/faq#returns" className="text-sm font-medium text-[#111827] hover:underline">
          {copy.rules}
        </Link>
      </div>

      <section className="surface p-6 text-sm leading-relaxed text-[#374151]">
        <p className="text-[#6b7280]">{T("aftersales_lead")}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h2 className="font-semibold text-[#111827]">{copy.types}</h2>
            <p className="mt-1 text-xs text-[#9ca3af]">{copy.typesHint}</p>
            <ul className="mt-3 space-y-2">
              {AFTER_SALES_ISSUE_TYPES.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => openApply(item)}
                    className="w-full rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-left text-sm text-[#111827] hover:border-[#111827]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h2 className="font-semibold text-[#111827]">{copy.evidence}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[#6b7280]">
              {EVIDENCE[lang].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <button type="button" onClick={() => openApply("")} className="btn-primary">
          {T("aftersales_title")}
        </button>
      </div>

      <AfterSalesApplySheet open={open} onClose={() => setOpen(false)} initialIssueType={initialIssueType} />
    </div>
  );
}
