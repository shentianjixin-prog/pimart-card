import Link from "next/link";
import { cookies } from "next/headers";
import { SUPPORT_EMAIL } from "@/lib/site";
import { resolveLang, t } from "@/lib/translations";

const CONTACT_NOTICE = {
  zh: {
    title: "咨询前请确认",
    items: [
      "订单、物流、售后咨询请尽量提供订单号、注册邮箱、物流单号和问题照片/视频，便于我们核实。",
      "请勿通过邮件发送完整银行卡号、信用卡安全码、登录密码、一次性验证码等敏感信息。",
      "如代他人咨询、填写收货信息或提交售后资料，请先取得相关人员同意，并确保信息真实准确。",
      "发送咨询即表示您理解相关信息将用于身份确认、问题处理、回复通知、售后举证及安全风控。",
    ],
    linksTitle: "相关规则",
    terms: "用户协议",
    privacy: "隐私政策",
    returns: "售后说明",
  },
  ja: {
    title: "お問い合わせ前のご確認",
    items: [
      "注文、配送、アフターサポートの場合は、注文番号、登録メール、追跡番号、写真または動画をご用意ください。",
      "カード番号、セキュリティコード、ログインパスワード、ワンタイムコード等の機微情報はメールで送信しないでください。",
      "第三者の情報を入力または代理で問い合わせる場合は、事前に本人の同意を取得し、正確な情報をご提供ください。",
      "お問い合わせの送信により、本人確認、問題対応、返信、証憑確認、安全管理のために情報を利用することを理解したものとします。",
    ],
    linksTitle: "関連ルール",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    returns: "返品・交換",
  },
  en: {
    title: "Before Contacting Us",
    items: [
      "For orders, shipping, or after-sales, include your order number, account email, tracking number, and photos or video when possible.",
      "Do not send full card numbers, security codes, login passwords, or one-time verification codes by email.",
      "If you contact us on behalf of someone else or provide another person's delivery/support information, obtain their consent first and ensure accuracy.",
      "By contacting us, you understand that the information may be used for identity checks, support handling, replies, evidence review, and security controls.",
    ],
    linksTitle: "Related Rules",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    returns: "Returns",
  },
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);
  const notice = CONTACT_NOTICE[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{T("footer_contact")}</h1>
      <div className="surface space-y-5 p-6 text-sm text-[#374151]">
        <p className="text-[#6b7280]">{T("contact_desc")}</p>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="btn-primary inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium sm:max-w-md"
        >
          {SUPPORT_EMAIL}
        </a>

        <section className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4">
          <h2 className="text-base font-semibold text-[#111827]">{notice.title}</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-[#6b7280]">
            {notice.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="font-medium text-[#6b7280]">{notice.linksTitle}</span>
            <Link href="/terms" className="font-medium text-[#111827] hover:underline">
              {notice.terms}
            </Link>
            <Link href="/privacy" className="font-medium text-[#111827] hover:underline">
              {notice.privacy}
            </Link>
            <Link href="/after-sales" className="font-medium text-[#111827] hover:underline">
              {notice.returns}
            </Link>
          </div>
        </section>

        <ul className="list-disc space-y-2 pl-5 text-[#6b7280]">
          <li>{T("contact_hours")}</li>
          <li>{T("contact_reply")}</li>
          <li>
            {T("contact_support_label")}：{SUPPORT_EMAIL}
          </li>
        </ul>

        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {T("contact_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
