import { cookies } from "next/headers";
import { BuybackForm } from "@/components/BuybackForm";
import { resolveLang } from "@/lib/translations";

const NOTICE = {
  zh: {
    title: "买取审核提示",
    items: [
      "线上填写或沟通的价格仅为参考，最终査定以实物到达后的真伪、版本、语言、品相、市场流动性和库存需求为准。",
      "请勿提交盗品、仿品、改卡、重封、调包、来源不明或权利受限商品；本站可拒收、退回或依法提供相关信息。",
      "未满 18 岁的用户需监护人同意，并按页面要求提供监护人信息及本人确认资料。",
    ],
  },
  ja: {
    title: "買取査定に関するご案内",
    items: [
      "オンライン上の案内価格は参考価格です。最終査定は実物到着後、真贋、版、言語、状態、相場、在庫需要により決定します。",
      "盗品、偽物、改造品、再封品、すり替え品、出所不明品、権利に問題がある商品は受付できません。必要に応じて関係機関へ情報提供する場合があります。",
      "18歳未満のお客様は保護者の同意が必要です。画面の案内に従って保護者情報と本人確認資料をご準備ください。",
    ],
  },
  en: {
    title: "Buyback Review Notes",
    items: [
      "Online estimates are for reference only. Final appraisal depends on authenticity, version, language, condition, market liquidity, and inventory demand after we receive the item.",
      "Do not submit stolen, counterfeit, altered, resealed, swapped, unknown-origin, or rights-restricted items. We may refuse, return, or provide information to authorities when required.",
      "Users under 18 need guardian consent and must provide guardian details and verification materials as instructed.",
    ],
  },
};

export default async function BuybackPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const notice = NOTICE[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-5 text-sm shadow-sm">
        <h1 className="text-base font-semibold text-[#111827]">{notice.title}</h1>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-[#6b7280]">
          {notice.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <BuybackForm lang={lang} />
    </div>
  );
}
