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
          "现货商品：下单后 5-7 个工作日内安排发货",
          "预售商品：将在预计发货日或到货后优先安排发货，详情页会标注预售信息",
          "预售商品同样支持正常下单支付，发货时间以商品页说明为准",
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
          "如收到商品与描述不符或运输途中损坏，请在收货后 7 天内联系我们处理",
          "原盒及 sealed 商品一经拆封，原则上不支持因个人原因退换",
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
          "現物商品：ご注文後5〜7営業日以内に発送します",
          "予約商品：発送予定日または入荷後、優先的に発送します。詳細は商品ページをご確認ください",
          "予約商品も通常どおりご注文・お支払いが可能です",
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
          "商品説明と異なる場合や輸送中の損傷があった場合は、受取後7日以内にご連絡ください",
          "未開封BOXおよびsealedの商品は、お客様都合の返品・交換は原則お受けできません",
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
          "In-stock items: Ships within 5–7 business days after your order",
          "Pre-order items: Shipped first upon arrival or on the scheduled ship date — details on the product page",
          "Pre-orders can be placed and paid for in the same way as in-stock items",
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
          "If you receive an item that doesn't match the description or was damaged in transit, contact us within 7 days of receipt",
          "Sealed and unopened products cannot be returned for personal reasons once the seal is broken",
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
