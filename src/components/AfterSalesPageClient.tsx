"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AFTER_SALES_ISSUE_TYPES,
  AfterSalesApplySheet,
  type AfterSalesIssueType,
} from "@/components/AfterSalesApplySheet";

const EVIDENCE = [
  "订单号、注册邮箱和物流单号",
  "外箱六面照片、物流面单照片、内包装照片",
  "从未开封外箱开始连续拍摄到取出商品的完整开箱视频",
  "问题位置的清晰照片或视频",
  "请在处理完成前保留外箱、面单、缓冲材料和商品原状态",
];

export function AfterSalesPageClient() {
  const [open, setOpen] = useState(false);
  const [initialIssueType, setInitialIssueType] = useState<AfterSalesIssueType | "">("");

  function openApply(issueType: AfterSalesIssueType | "" = "") {
    setInitialIssueType(issueType);
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">After-sales</p>
          <h1 className="section-title mt-2">售后申请</h1>
        </div>
        <Link href="/faq#returns" className="text-sm font-medium text-[#111827] hover:underline">
          查看售后规则
        </Link>
      </div>

      <section className="surface p-6 text-sm leading-relaxed text-[#374151]">
        <p className="text-[#6b7280]">
          运输破损、错发、漏发、明显初期不良等问题，请在物流签收后 7 日内提交。个人喜好、价格波动、开封结果不理想、轻微盒损或封膜褶皱，原则上不属于售后范围。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h2 className="font-semibold text-[#111827]">可选问题类型</h2>
            <p className="mt-1 text-xs text-[#9ca3af]">点击类型即可开始申请</p>
            <ul className="mt-3 space-y-2">
              {AFTER_SALES_ISSUE_TYPES.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => openApply(item)}
                    className="flex min-h-11 w-full items-center justify-between rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white px-3 text-left text-sm font-medium text-[#374151] transition hover:border-[#111827] hover:bg-[#fff]"
                  >
                    <span>{item}</span>
                    <span className="text-xs text-[#9ca3af]">申请</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h2 className="font-semibold text-[#111827]">必须准备的证据</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[#6b7280]">
              {EVIDENCE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[#fee2e2] bg-[#fff7f7] p-4 text-[#7f1d1d]">
          请勿先自行丢弃包装、拆除面单、寄回商品或发起到付退货。未经客服确认的退货、到付件或证据不足的申请，可能无法受理。
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => openApply("")}
            className="btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium"
          >
            申请售后
          </button>
          <Link
            href="/contact"
            className="btn-secondary inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium"
          >
            联系客服
          </Link>
        </div>

        <p className="mt-4 text-xs text-[#9ca3af]">
          申请会打开邮件草稿并带入已填信息。证据照片/视频请作为邮件附件发送；网页暂不接收上传。
        </p>
      </section>

      <AfterSalesApplySheet
        open={open}
        onClose={() => setOpen(false)}
        initialIssueType={initialIssueType}
      />
    </div>
  );
}
