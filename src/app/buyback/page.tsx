import Link from "next/link";
import { cookies } from "next/headers";
import { resolveLang } from "@/lib/translations";

const NOTICE = {
  zh: {
    eyebrow: "Buyback",
    title: "买取功能暂未开放",
    body: "目前不接受买取申请，也不会收集买取表单、身份证明或收款账户信息。开放时间请关注网站公告。",
    back: "返回首页",
  },
  ja: {
    eyebrow: "Buyback",
    title: "買取機能は現在ご利用いただけません",
    body: "現在、買取申込は受け付けておらず、買取フォーム、本人確認書類、振込先口座情報の収集も行っていません。再開時期はサイトのお知らせをご確認ください。",
    back: "ホームに戻る",
  },
  en: {
    eyebrow: "Buyback",
    title: "Buyback is not currently available",
    body: "We are not accepting buyback applications or collecting buyback forms, identity documents, or payout account details. Please check site announcements for future availability.",
    back: "Back to home",
  },
};

export default async function BuybackPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const notice = NOTICE[lang];

  return (
    <div className="mx-auto flex min-h-[56vh] max-w-3xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="surface w-full p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">{notice.eyebrow}</p>
        <h1 className="section-title mt-3">{notice.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6b7280]">{notice.body}</p>
        <Link href="/" className="btn-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-medium">
          {notice.back}
        </Link>
      </div>
    </div>
  );
}
