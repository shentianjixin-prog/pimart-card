import Link from "next/link";
import { cookies } from "next/headers";
import { resolveLang } from "@/lib/translations";

type Section = { title: string; items: string[] };

const DATA: Record<
  "zh" | "ja" | "en",
  {
    title: string;
    sections: Section[];
    footer: { pre: string; contactLabel: string; orWord: string; shippingLabel: string; homeLabel: string; post: string };
  }
> = {
  zh: {
    title: "购物指南",
    sections: [
      {
        title: "购买流程",
        items: [
          "在首页浏览商品，或用筛选按分类、现货/预售、价格区间查找",
          "进入商品详情页，确认系列、价格与发货说明后添加到购物车",
          "在购物车页面确认后前往结算，跳转 Stripe 安全支付页面完成付款",
          "支付成功后会返回订单完成页，我们会尽快安排发货",
        ],
      },
      {
        title: "现货与预售",
        items: [
          "现货商品：下单后按商品页与结账说明尽快安排发货",
          "预售商品页的「预计发货/到货」仅为参考，可能因出荷、质检、清关等延迟；实际以发货为准",
          "自首次展示的预计发货日起满 90 日仍未发货（且未发货）的，可就该商品按实付金额申请退款",
          "下单付款即视为已阅读并同意商品页说明与用户协议",
        ],
      },
      {
        title: "支付方式",
        items: [
          "目前通过 Stripe 提供在线信用卡支付，支持 Visa / Mastercard / JCB 等",
          "支付过程全程由 Stripe 加密处理，本站不会接触或保存您的卡号信息",
        ],
      },
      {
        title: "配送说明",
        items: [
          "原盒商品使用专用纸箱及缓冲材料包装",
          "发货后我们将通过邮件发送物流信息",
        ],
      },
      {
        title: "售后与退换货",
        items: [
          "未开封原盒、预售、随机/开封类：不适用笼统「七天无理由」；个人原因原则上不退换",
          "可受理：运输破损、错发、漏发——请于签收后 7 日内联系，并提供完整开箱视频与照片",
          "轻微外箱压痕等不影响 sealed 的，一般不视为质量问题；开封结果随机，不保证特定卡",
          "详细规则见「用户协议」与 FAQ「售后与退换」",
        ],
      },
    ],
    footer: {
      pre: "还有其他疑问？欢迎查看",
      contactLabel: "联系方式",
      orWord: "或",
      shippingLabel: "发货说明",
      homeLabel: "返回首页",
      post: "继续选购。",
    },
  },
  ja: {
    title: "ショッピングガイド",
    sections: [
      {
        title: "ご購入の流れ",
        items: [
          "トップページで商品を閲覧するか、フィルターでカテゴリー・現物/予約・価格帯で絞り込む",
          "商品詳細ページでシリーズ・価格・配送情報を確認してカートに追加",
          "カートページで内容を確認後、レジへ進む。Stripeの安全な決済ページでお支払い完了",
          "お支払い完了後は注文完了ページに戻り、できるだけ早く発送手配をいたします",
        ],
      },
      {
        title: "現物と予約商品",
        items: [
          "現物商品：商品ページ・決済画面の案内に従い、できるだけ早く発送します",
          "予約ページの発送/入荷予定は目安です。出荷・検品・通関等で遅れる場合があり、実際の発送をもって確定します",
          "初回表示の発送予定日から90日経過しても未発送の場合、当該商品の実支払額で返金申請できます",
          "ご注文・お支払いをもって、商品ページと利用規約に同意したものとみなします",
        ],
      },
      {
        title: "お支払い方法",
        items: [
          "Stripeによるオンラインクレジットカード決済（Visa / Mastercard / JCB 等）に対応",
          "決済はStripeが暗号化処理。当店がカード番号を保持することはありません",
        ],
      },
      {
        title: "配送について",
        items: [
          "未開封BOXは専用ダンボールと緩衝材で梱包します",
          "発送後、メールで追跡情報をお送りします",
        ],
      },
      {
        title: "返品・交換について",
        items: [
          "未開封BOX・予約・ランダム/開封系は特殊商品で、一律のクーリングオフは適用されません。お客様都合の返品は原則不可です",
          "対応可：輸送破損・誤発送・欠品。受取後7日以内にご連絡のうえ、開封動画と写真をご提出ください",
          "sealedに影響しない軽い外箱痕などは原則品質問題としません。開封結果はランダムで特定カードを保証しません",
          "詳細は「利用規約」と FAQ「返品・交換」をご確認ください",
        ],
      },
    ],
    footer: {
      pre: "他にご質問がありますか？",
      contactLabel: "お問い合わせ",
      orWord: "または",
      shippingLabel: "配送について",
      homeLabel: "ホームに戻る",
      post: "引き続きショッピングをお楽しみください。",
    },
  },
  en: {
    title: "Shopping Guide",
    sections: [
      {
        title: "How to Buy",
        items: [
          "Browse products on the homepage, or use filters to narrow by category, stock status, or price range",
          "Go to the product detail page to confirm series, price, and shipping info, then add to cart",
          "Review your cart and proceed to checkout — complete payment via Stripe's secure page",
          "After payment, you'll be returned to an order confirmation page and we'll arrange shipping promptly",
        ],
      },
      {
        title: "In-Stock vs Pre-order",
        items: [
          "In-stock: We dispatch as soon as practical per the product page and checkout notes",
          "Pre-order “estimated ship/arrival” dates are references only and may slip due to production, QC, or customs; actual ship date controls",
          "If still unshipped 90 days after the first displayed estimate, you may request a refund of that item’s amount paid",
          "Placing and paying an order means you accept the product page and Terms",
        ],
      },
      {
        title: "Payment",
        items: [
          "We accept online credit card payments via Stripe (Visa / Mastercard / JCB, etc.)",
          "All payments are encrypted by Stripe — we never store your card information",
        ],
      },
      {
        title: "Shipping",
        items: [
          "Sealed boxes are packed in dedicated cardboard boxes with protective padding",
          "You'll receive a shipping notification email with tracking info after dispatch",
        ],
      },
      {
        title: "Returns & Exchanges",
        items: [
          "Sealed boxes, pre-orders, and random/open-pack items are special categories—no blanket no-reason returns; preference returns are generally declined",
          "Eligible: transit damage, wrong/missing item—contact within 7 days of delivery with a full unboxing video and photos",
          "Minor box dents that don’t break the seal are usually not defects; pulls are random and specific cards are not guaranteed",
          "See Terms of Use and FAQ Returns for full rules",
        ],
      },
    ],
    footer: {
      pre: "Have more questions?",
      contactLabel: "Contact Us",
      orWord: "or",
      shippingLabel: "Shipping Info",
      homeLabel: "Back to Home",
      post: "to continue browsing.",
    },
  },
};

export default async function GuidePage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const d = DATA[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-8">{d.title}</h1>

      <div className="space-y-10">
        {d.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-[#111827]">{section.title}</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#6b7280]">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="surface mt-12 p-5 text-sm text-[#6b7280]">
        {d.footer.pre}{" "}
        <Link href="/contact" className="mx-1 font-medium text-[#111827] hover:underline">
          {d.footer.contactLabel}
        </Link>
        {d.footer.orWord}{" "}
        <Link href="/shipping" className="mx-1 font-medium text-[#111827] hover:underline">
          {d.footer.shippingLabel}
        </Link>
        {lang === "zh" ? "，也可以" : "，"}
        <Link href="/" className="mx-1 font-medium text-[#111827] hover:underline">
          {d.footer.homeLabel}
        </Link>
        {d.footer.post}
      </div>
    </div>
  );
}
