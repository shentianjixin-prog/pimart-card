import Link from "next/link";
import { cookies } from "next/headers";
import { JAPAN_DELIVERY_CONTACT_ADDRESS } from "@/lib/site";
import { resolveLang } from "@/lib/translations";

type Section = { title: string; items: string[] };

const DATA: Record<"zh" | "ja" | "en", { title: string; lead: string; sections: Section[]; back: string }> = {
  zh: {
    title: "配送与运费",
    lead: "请在下单前确认商品页面的发货地、现货/预售状态和配送说明。集换式卡牌、未开封盒和预售商品对签收证据要求较高，请保留外箱与开箱记录。",
    back: "返回首页",
    sections: [
      {
        title: "发货时效",
        items: [
          "本站以亚洲为履约枢纽；每件商品的实际发货地以商品页面、订单和物流信息为准。",
          "现货商品：支付确认后通常 5-7 个工作日内安排发货。",
          "预售商品：以商品页面标注的发售/到货时间为准，到货后按订单顺序发货。",
          "调货或海外直送商品：可能受供应商、通关、物流节点影响，实际时间以物流进度为准。",
        ],
      },
      {
        title: "日本配送联络地址",
        items: [
          `${JAPAN_DELIVERY_CONTACT_ADDRESS}。该地址仅用于日本配送联络，不是销售主体所在地，也不是未经确认即可寄回的退货地址。`,
          "任何退货或售后寄送都须先联系客户服务，并以客服书面指定的地址为准。",
        ],
      },
      {
        title: "运费与附加费用",
        items: [
          "运费会在结算页面或商品页面显示，最终以提交订单时显示的金额为准。",
          "因地址错误、无人签收、拒收、逾期取件导致的退回、重寄、保管等费用，由用户承担。",
          "海外直送或跨境商品如产生关税、进口消费税、通关手续费等，由收件人承担。",
        ],
      },
      {
        title: "合单与拆单",
        items: [
          "现货与预售同单购买时，可能等待预售到货后合并发出，也可能根据实际情况拆分发货。",
          "同一订单包含不同仓库或不同发货地商品时，可能分批发出并产生多个物流单号。",
        ],
      },
      {
        title: "签收与破损处理",
        items: [
          "签收时请检查外箱是否破损、浸水、拆封或重量异常。",
          "如发现问题，请保留外箱、面单、填充物、商品照片和开箱视频，并在收货后 7 日内联系我们。",
          "物流显示妥投、代签或投递柜入库后，若缺少连续证据，本站可能无法向物流方追责或受理售后。",
        ],
      },
      {
        title: "不可抗力与延误",
        items: [
          "天气、灾害、海关检查、节假日、交通管制、发行商延期、物流拥堵等可能导致延误。",
          "本站会尽量协助查询物流，但不对超出可控范围的延误承担额外赔偿。",
        ],
      },
    ],
  },
  ja: {
    title: "配送・送料",
    lead: "ご注文前に商品ページの発送元、在庫/予約区分、配送条件をご確認ください。カード商品は受取時の証拠保全が重要です。",
    back: "ホームに戻る",
    sections: [
      { title: "発送目安", items: ["当店はアジアを履行拠点とし、実際の発送元は商品ページ、注文情報および追跡情報に表示します。", "在庫商品：決済確認後、通常 5〜7 営業日以内に発送します。", "予約商品：商品ページ記載の発売・入荷時期を基準に、入荷後順次発送します。", "取り寄せ・海外直送品は仕入先、通関、物流状況により遅延する場合があります。"] },
      { title: "日本配送連絡先", items: [`${JAPAN_DELIVERY_CONTACT_ADDRESS}。販売業者の所在地ではなく、事前確認なしに返品できる住所でもありません。`, "返品・アフターサポートの送付先は、必ず事前にカスタマーサポートへ連絡し、書面で指定された住所をご利用ください。"] },
      { title: "送料・追加費用", items: ["送料は決済画面または商品ページに表示されます。", "住所不備、不在、受取拒否、保管期限超過による返送・再送費用はお客様負担となります。", "関税、輸入消費税、通関手数料等が発生する場合は受取人負担となります。"] },
      { title: "同梱・分割発送", items: ["在庫商品と予約商品を同時購入した場合、入荷待ちまたは分割発送となる場合があります。", "発送元が異なる商品は複数の追跡番号で発送される場合があります。"] },
      { title: "受取・破損時の対応", items: ["受取時に外箱の破損、水濡れ、開封跡、重量異常をご確認ください。", "問題がある場合は外箱、伝票、梱包材、商品写真、開封動画を保管し、到着後 7 日以内にご連絡ください。", "配達完了後、連続した証拠がない場合は対応が難しいことがあります。"] },
      { title: "不可抗力・遅延", items: ["天候、災害、税関検査、祝日、交通規制、メーカー延期、物流混雑等で遅延する場合があります。", "当店は追跡確認に協力しますが、管理外の遅延について追加補償はいたしかねます。"] },
    ],
  },
  en: {
    title: "Shipping & Fees",
    lead: "Before ordering, check the product page for origin, stock/pre-order status, and shipping notes. Keep packaging and opening evidence for sealed card products.",
    back: "Back to home",
    sections: [
      { title: "Dispatch Timing", items: ["We use Asia as our fulfillment hub. The actual dispatch origin is shown on the product page, order information, and tracking details.", "In-stock items usually ship within 5-7 business days after payment confirmation.", "Pre-orders ship after release or arrival according to the product page.", "Backordered or cross-border items may be delayed by suppliers, customs, or carriers."] },
      { title: "Japan Delivery Contact Address", items: [`${JAPAN_DELIVERY_CONTACT_ADDRESS}. This is a delivery contact address, not the seller's registered address or an unapproved return address.`, "Contact customer support before any return and use only the return address provided in writing."] },
      { title: "Shipping Fees", items: ["Shipping fees are shown on the product or checkout page.", "Return, reshipment, or storage fees caused by wrong address, refusal, absence, or missed pickup are borne by the customer.", "Customs duties, import taxes, and clearance fees are borne by the recipient when applicable."] },
      { title: "Combined / Split Shipping", items: ["Orders containing both in-stock and pre-order items may wait for all items or ship separately.", "Items from different warehouses may be sent with separate tracking numbers."] },
      { title: "Receipt & Damage Claims", items: ["Check the outer box when receiving the parcel.", "If damaged, keep the box, label, packing material, product photos, and opening video, then contact us within 7 days.", "After tracking shows delivered, claims may be difficult without continuous evidence."] },
      { title: "Delays", items: ["Weather, customs, holidays, traffic control, publisher delays, and carrier congestion may affect delivery.", "We will assist with tracking but cannot compensate for delays outside our control."] },
    ],
  },
};

export default async function ShippingPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const d = DATA[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-4">{d.title}</h1>
      <p className="mb-6 text-sm leading-relaxed text-[#6b7280]">{d.lead}</p>
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
