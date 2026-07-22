"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";

export const AFTER_SALES_ISSUE_TYPES = [
  "运输破损",
  "错发商品",
  "漏发/少件",
  "明显初期不良",
  "其他订单问题",
] as const;

export type AfterSalesIssueType = (typeof AFTER_SALES_ISSUE_TYPES)[number];

type Props = {
  open: boolean;
  onClose: () => void;
  initialIssueType?: AfterSalesIssueType | "";
};

type FormState = {
  issueType: AfterSalesIssueType | "";
  orderNumber: string;
  email: string;
  trackingNumber: string;
  receivedAt: string;
  description: string;
  keepPackaging: "是" | "否" | "";
};

const EMPTY_FORM: FormState = {
  issueType: "",
  orderNumber: "",
  email: "",
  trackingNumber: "",
  receivedAt: "",
  description: "",
  keepPackaging: "",
};

function buildMailBody(form: FormState, fileNames: string[]) {
  return [
    "PIMART CARD 售后申请",
    "",
    `订单号：${form.orderNumber.trim()}`,
    `注册邮箱：${form.email.trim()}`,
    `物流单号：${form.trackingNumber.trim() || "（未填写）"}`,
    `问题类型：${form.issueType}`,
    `签收日期：${form.receivedAt || "（未填写）"}`,
    `是否保留外箱、面单和包装材料：${form.keepPackaging || "（未填写）"}`,
    "",
    "问题说明：",
    form.description.trim() || "（未填写）",
    "",
    fileNames.length > 0
      ? `拟附证据文件（请在邮件中手动添加附件）：\n${fileNames.map((n) => `- ${n}`).join("\n")}`
      : "拟附证据文件：暂未选择（请在邮件中手动添加照片/视频）",
    "",
    "我确认以上信息真实，并理解售后申请需在签收后7日内提交，证据不足或包装已丢弃可能无法受理。",
  ].join("\n");
}

export function AfterSalesApplySheet({ open, onClose, initialIssueType = "" }: Props) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_FORM, issueType: initialIssueType || "" });
    setFiles([]);
    setError(null);
    setHint(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, initialIssueType]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) {
      setFiles([]);
      return;
    }
    const next = Array.from(list).slice(0, 12);
    setFiles(next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setHint(null);

    if (!form.issueType) {
      setError("请先选择问题类型。");
      return;
    }
    if (!form.orderNumber.trim()) {
      setError("请填写订单号。");
      return;
    }
    if (!form.email.trim()) {
      setError("请填写注册邮箱。");
      return;
    }

    const fileNames = files.map((f) => f.name);
    const subject = `PIMART CARD 售后申请 - ${form.issueType} - 订单号：${form.orderNumber.trim()}`;
    const body = buildMailBody(form, fileNames);
    const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // mailto 无法自动带附件；先打开邮件，再提示用户手动附上已选文件
    window.location.href = href;
    setHint(
      fileNames.length > 0
        ? `已打开邮件草稿。请手动附上这些文件后再发送：${fileNames.join("、")}。本站暂不接收网页上传。`
        : "已打开邮件草稿。请在邮件中附上外箱/面单/开箱视频等证据后再发送。本站暂不接收网页上传。"
    );
  }

  return (
    <div className="buy-sheet-root" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="buy-sheet-backdrop" aria-label="关闭" onClick={onClose} />
      <div className="buy-sheet-panel after-sales-sheet-panel">
        <div className="buy-sheet-header">
          <div className="pr-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">After-sales</p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold text-[#111827]">
              提交售后申请
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
              选择问题类型并填写信息。证据文件请随邮件附件发送，网页暂不上传到服务器。
            </p>
          </div>
          <button type="button" className="buy-sheet-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="buy-sheet-body space-y-5">
            <div>
              <p className="buy-sheet-label">问题类型</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {AFTER_SALES_ISSUE_TYPES.map((type) => {
                  const active = form.issueType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("issueType", type)}
                      className={`min-h-11 rounded-2xl border px-3 text-left text-sm font-medium transition ${
                        active
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[rgba(17,24,39,0.12)] bg-white text-[#374151] hover:bg-[#f7f8fa]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="buy-sheet-label">订单号</span>
              <input
                required
                value={form.orderNumber}
                onChange={(e) => update("orderNumber", e.target.value)}
                className="mt-0 w-full rounded-2xl border border-[rgba(17,24,39,0.12)] px-3 py-2.5 text-sm outline-none focus:border-[#111827]"
                placeholder="例如 ORD-xxxx"
                autoComplete="off"
              />
            </label>

            <label className="block">
              <span className="buy-sheet-label">注册邮箱</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-0 w-full rounded-2xl border border-[rgba(17,24,39,0.12)] px-3 py-2.5 text-sm outline-none focus:border-[#111827]"
                placeholder="下单时使用的邮箱"
                autoComplete="email"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="buy-sheet-label">物流单号</span>
                <input
                  value={form.trackingNumber}
                  onChange={(e) => update("trackingNumber", e.target.value)}
                  className="mt-0 w-full rounded-2xl border border-[rgba(17,24,39,0.12)] px-3 py-2.5 text-sm outline-none focus:border-[#111827]"
                  placeholder="可选"
                  autoComplete="off"
                />
              </label>
              <label className="block">
                <span className="buy-sheet-label">签收日期</span>
                <input
                  type="date"
                  value={form.receivedAt}
                  onChange={(e) => update("receivedAt", e.target.value)}
                  className="mt-0 w-full rounded-2xl border border-[rgba(17,24,39,0.12)] px-3 py-2.5 text-sm outline-none focus:border-[#111827]"
                />
              </label>
            </div>

            <fieldset>
              <legend className="buy-sheet-label">是否保留包装材料</legend>
              <div className="flex gap-2">
                {(["是", "否"] as const).map((opt) => {
                  const active = form.keepPackaging === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("keepPackaging", opt)}
                      className={`min-h-10 flex-1 rounded-full border text-sm font-medium ${
                        active
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[rgba(17,24,39,0.12)] text-[#374151]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="block">
              <span className="buy-sheet-label">问题说明</span>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="mt-0 w-full resize-y rounded-2xl border border-[rgba(17,24,39,0.12)] px-3 py-2.5 text-sm outline-none focus:border-[#111827]"
                placeholder="请简要描述问题，并说明是否已保留外箱、面单与开箱视频。"
              />
            </label>

            <div>
              <p className="buy-sheet-label">证据文件（本地选择，随邮件发送）</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="block w-full text-sm text-[#6b7280] file:mr-3 file:rounded-full file:border-0 file:bg-[#111827] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />
              {files.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-[#6b7280]">
                  {files.map((f) => (
                    <li key={`${f.name}-${f.size}-${f.lastModified}`}>
                      {f.name}（{(f.size / 1024 / 1024).toFixed(2)} MB）
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[#9ca3af]">
                  可多选照片/视频。提交后会打开邮件草稿，请手动添加附件。
                </p>
              )}
            </div>

            {error ? <p className="buy-sheet-error">{error}</p> : null}
            {hint ? <p className="rounded-2xl bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">{hint}</p> : null}
          </div>

          <div className="buy-sheet-footer">
            <div className="buy-sheet-actions">
              <button type="submit" className="btn-primary rounded-full px-5 text-sm font-medium">
                打开邮件并发送申请
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
