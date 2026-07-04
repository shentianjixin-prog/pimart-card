"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { submitBuybackRequest, type BuybackFormState } from "@/app/buyback/actions";
import { LINE_CONTACT_URL } from "@/lib/site";
import type { Lang } from "@/lib/translations";

type Copy = {
  title: string;
  lineBtn: string;
  formTitle: string;
  required: string;
  name: string;
  nameKana: string;
  email: string;
  message: string;
  messagePh: string;
  toConfirm: string;
  confirmTitle: string;
  back: string;
  submit: string;
  successTitle: string;
  successDesc: string;
  home: string;
  errRequired: string;
  errEmail: string;
  errServer: string;
};

const COPY: Record<Lang, Copy> = {
  zh: {
    title: "卡牌买取",
    lineBtn: "通过 LINE 咨询买取",
    formTitle: "表单提交买取咨询",
    required: "必填",
    name: "姓名",
    nameKana: "姓名（假名）",
    email: "邮箱",
    message: "买取内容",
    messagePh: "请填写卡牌名称、数量、品相、期望价格等",
    toConfirm: "前往确认",
    confirmTitle: "请确认填写内容",
    back: "返回修改",
    submit: "提交",
    successTitle: "已收到您的买取咨询",
    successDesc: "我们会在 1–2 个工作日内通过邮箱回复，紧急事项建议同时通过 LINE 联系我们。",
    home: "返回首页",
    errRequired: "请填写所有必填项",
    errEmail: "邮箱格式不正确",
    errServer: "提交失败，请稍后重试或通过 LINE 联系",
  },
  ja: {
    title: "買取のお問い合わせ",
    lineBtn: "LINEでお問い合わせ",
    formTitle: "フォームからお問い合わせ",
    required: "必須",
    name: "お名前",
    nameKana: "お名前（カナ）",
    email: "メールアドレス",
    message: "お問合わせ内容",
    messagePh: "カード名・枚数・状態・希望価格などをご記入ください",
    toConfirm: "確認画面へ",
    confirmTitle: "入力内容の確認",
    back: "修正する",
    submit: "送信する",
    successTitle: "買取のお問い合わせを受け付けました",
    successDesc: "通常1〜2営業日以内にメールでご返信します。お急ぎの場合はLINEもご利用ください。",
    home: "ホームに戻る",
    errRequired: "必須項目を入力してください",
    errEmail: "メールアドレスの形式が正しくありません",
    errServer: "送信に失敗しました。しばらくしてから再度お試しください",
  },
  en: {
    title: "Card Buyback",
    lineBtn: "Contact via LINE",
    formTitle: "Inquiry via Form",
    required: "Required",
    name: "Name",
    nameKana: "Name (Kana)",
    email: "Email",
    message: "Inquiry details",
    messagePh: "Card name, quantity, condition, expected price, etc.",
    toConfirm: "Review",
    confirmTitle: "Confirm your details",
    back: "Edit",
    submit: "Submit",
    successTitle: "Buyback inquiry received",
    successDesc: "We typically reply within 1–2 business days. For urgent requests, please also contact us on LINE.",
    home: "Back to home",
    errRequired: "Please fill in all required fields",
    errEmail: "Invalid email address",
    errServer: "Submission failed. Please try again or contact us on LINE",
  },
};

type Draft = {
  name: string;
  nameKana: string;
  email: string;
  message: string;
};

const EMPTY: Draft = { name: "", nameKana: "", email: "", message: "" };

function errorMessage(copy: Copy, code?: string) {
  if (code === "email") return copy.errEmail;
  if (code === "server") return copy.errServer;
  if (code === "required") return copy.errRequired;
  return null;
}

export function BuybackForm({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [state, action, pending] = useActionState<BuybackFormState, FormData>(
    submitBuybackRequest,
    {}
  );

  useEffect(() => {
    if (state.ok) setStep("done");
  }, [state.ok]);

  if (step === "done") {
    return (
      <div className="buyback-panel text-center">
        <h2 className="text-lg font-semibold text-[#111827]">{copy.successTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{copy.successDesc}</p>
        <Link href="/" className="buyback-submit-btn mt-8 inline-flex min-h-11 items-center justify-center px-8">
          {copy.home}
        </Link>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="buyback-panel">
        <h2 className="buyback-section-title">{copy.confirmTitle}</h2>
        <dl className="mt-6 space-y-4 text-sm">
          {[
            [copy.name, draft.name],
            [copy.nameKana, draft.nameKana],
            [copy.email, draft.email],
            [copy.message, draft.message],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-[rgba(17,24,39,0.08)] pb-3">
              <dt className="text-[#9ca3af]">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[#111827]">{value}</dd>
            </div>
          ))}
        </dl>
        {errorMessage(copy, state.error) && (
          <p className="mt-4 text-sm text-red-600">{errorMessage(copy, state.error)}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => setStep("form")} className="btn-secondary min-h-11 rounded-full px-8">
            {copy.back}
          </button>
          <form action={action}>
            <input type="hidden" name="name" value={draft.name} />
            <input type="hidden" name="nameKana" value={draft.nameKana} />
            <input type="hidden" name="email" value={draft.email} />
            <input type="hidden" name="message" value={draft.message} />
            <button type="submit" disabled={pending} className="buyback-submit-btn min-h-11 w-full px-10 sm:w-auto">
              {pending ? "..." : copy.submit}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="buyback-page">
      <div className="mb-8 flex flex-col items-end gap-4 sm:flex-row sm:items-start sm:justify-between">
        <a
          href={LINE_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="buyback-line-btn order-2 w-full sm:order-1 sm:max-w-xs"
        >
          {copy.lineBtn}
        </a>
        <h1 className="order-1 text-2xl font-semibold text-[#111827] sm:order-2 sm:text-right">
          {copy.title}
        </h1>
      </div>

      <div className="buyback-panel">
        <h2 className="buyback-section-title">{copy.formTitle}</h2>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const next: Draft = {
              name: String(fd.get("name") || "").trim(),
              nameKana: String(fd.get("nameKana") || "").trim(),
              email: String(fd.get("email") || "").trim(),
              message: String(fd.get("message") || "").trim(),
            };
            if (!next.name || !next.nameKana || !next.email || !next.message) {
              return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
              return;
            }
            setDraft(next);
            setStep("confirm");
          }}
        >
          {[
            { key: "name", label: copy.name, type: "text" },
            { key: "nameKana", label: copy.nameKana, type: "text" },
            { key: "email", label: copy.email, type: "email" },
          ].map((field) => (
            <div key={field.key}>
              <label className="buyback-label" htmlFor={field.key}>
                {field.label}
                <span className="buyback-required">※</span>
              </label>
              <input
                id={field.key}
                name={field.key}
                type={field.type}
                required
                defaultValue={draft[field.key as keyof Draft]}
                className="buyback-input"
              />
            </div>
          ))}

          <div>
            <label className="buyback-label" htmlFor="message">
              {copy.message}
              <span className="buyback-required">※</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              defaultValue={draft.message}
              placeholder={copy.messagePh}
              className="buyback-input min-h-[140px] resize-y"
            />
          </div>

          <div className="pt-2 text-center">
            <button type="submit" className="buyback-submit-btn min-h-11 min-w-[200px] px-10">
              {copy.toConfirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
