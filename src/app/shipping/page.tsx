import Link from "next/link";
import { cookies } from "next/headers";
import { resolveLang } from "@/lib/translations";

type Section = { title: string; items: string[] };

const DATA: Record<"zh" | "ja" | "en", { title: string; sections: Section[]; back: string }> = {
  zh: {
    title: "发货说明",
    back: "返回首页",
    sections: [
      {
        title: "发货时效",
        items: [
          "现货商品：下单后 5-7 个工作日内发货",
          "预售商品：将在预计发货日或商品到货后尽快安排发货",
          "具体发货日以商品详情页标注为准",
        ],
      },
      {
        title: "发货通知",
        items: [
          "订单支付成功后，我们会尽快为您安排打包",
          "发货后我们将通过邮件发送物流信息",
        ],
      },
      {
        title: "包装说明",
        items: [
          "原盒商品使用专用纸箱及缓冲材料包装",
          "周边商品采用防潮包装，降低运输途中受损风险",
        ],
      },
    ],
  },
  ja: {
    title: "配送について",
    back: "ホームに戻る",
    sections: [
      {
        title: "発送目安",
        items: [
          "現物商品：ご注文後5〜7営業日以内に発送します",
          "予約商品：発送予定日または入荷後できるだけ早く発送します",
          "詳細は商品ページの記載をご確認ください",
        ],
      },
      {
        title: "発送通知",
        items: [
          "お支払い確認後、速やかに梱包の手配をいたします",
          "発送後にメールで物流情報をお送りします",
        ],
      },
      {
        title: "梱包について",
        items: [
          "未開封BOXは専用ダンボールと緩衝材で梱包します",
          "周辺グッズは防湿包装で輸送中のダメージリスクを低減します",
        ],
      },
    ],
  },
  en: {
    title: "Shipping Info",
    back: "Back to home",
    sections: [
      {
        title: "Shipping Timeline",
        items: [
          "In-stock items: Ships within 5–7 business days after order",
          "Pre-order items: Ships on or after the scheduled ship date",
          "Refer to the product page for exact shipping dates",
        ],
      },
      {
        title: "Shipping Notification",
        items: [
          "We begin preparing your order shortly after payment is confirmed",
          "You will receive a shipping notification email once dispatched",
        ],
      },
      {
        title: "Packaging",
        items: [
          "Sealed boxes are packed in dedicated cardboard boxes with padding",
          "Merchandise is packed with moisture protection to minimize transit damage",
        ],
      },
    ],
  },
};

export default async function ShippingPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const d = DATA[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{d.title}</h1>
      <div className="surface space-y-6 p-6 text-sm text-[#374151]">
        {d.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 font-semibold text-[#111827]">{section.title}</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-[#6b7280]">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
        <p>
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {d.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
