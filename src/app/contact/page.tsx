import Link from "next/link";
import { cookies } from "next/headers";
import { resolveLang } from "@/lib/translations";

const DATA = {
  zh: {
    title: "批发与联系",
    desc: "如需商品咨询、订单支持或批发询价，请通过以下方式联系我们：",
    items: [
      "邮箱：support@pimart-card.com",
      "工作时间：周一至周五 10:00–18:00（JST）",
      "通常在 1-2 个工作日内回复",
    ],
    back: "← 返回首页",
  },
  ja: {
    title: "卸売・お問い合わせ",
    desc: "商品のお問い合わせ、ご注文サポート、卸売のご相談はこちらからお気軽にどうぞ。",
    items: [
      "メール：support@pimart-card.com",
      "受付時間：月〜金 10:00〜18:00（JST）",
      "通常1〜2営業日以内にご返信します",
    ],
    back: "← ホームに戻る",
  },
  en: {
    title: "Wholesale & Contact",
    desc: "For product inquiries, order support, or wholesale supply requests, reach out through:",
    items: [
      "Email: support@pimart-card.com",
      "Hours: Mon–Fri 10:00–18:00 (JST)",
      "We typically respond within 1–2 business days",
    ],
    back: "← Back to home",
  },
} as const;

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const d = DATA[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{d.title}</h1>
      <div className="surface space-y-4 p-6 text-sm text-[#374151]">
        <p className="text-[#6b7280]">{d.desc}</p>
        <ul className="list-disc space-y-2 pl-5 text-[#6b7280]">
          {d.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {d.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
