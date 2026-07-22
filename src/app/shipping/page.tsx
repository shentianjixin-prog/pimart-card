import Link from "next/link";
import { cookies } from "next/headers";
import { JAPAN_DELIVERY_CONTACT_ADDRESS, SUPPORT_EMAIL } from "@/lib/site";
import { resolveLang } from "@/lib/translations";

type Section = { title: string; items: string[] };

const DATA: Record<"zh" | "ja" | "en", { title: string; lead: string; sections: Section[]; back: string }> = {
  zh: {
    title: "配送与运费",
    lead: "商品统一进口至日本履约点后，由日本国内承运商进行配送。国际干线运输、进口清关及入库成本已计入商品价格；日本国内运费按收货都道府县在结账页计算。",
    back: "返回首页",
    sections: [
      {
        title: "发货时效",
        items: [
          "商品统一进口至日本履约点后，由日本国内承运商进行配送。",
          "现货商品：支付确认后通常 5-7 个工作日内安排发货。",
          "预售商品：以商品页面标注的发售/到货时间为准，到货后按订单顺序发货。",
          "调货商品可能受供应商、进口通关和物流节点影响，实际时间以物流进度为准。",
        ],
      },
      {
        title: "日本国内运费",
        items: [
          "东京都、关东、东北、信越、北陆、东海：¥330。",
          "近畿、中国、四国：¥660。北海道、九州：¥880。冲绳：¥1,250。",
          "购物车选择收货都道府县后，会显示日本国内运费和最终付款金额。",
        ],
      },
      {
        title: "日本履约与退货联系",
        items: [
          `${JAPAN_DELIVERY_CONTACT_ADDRESS}。该地址是日本国内履约地址，不是未经确认即可寄回的退货地址。`,
          `退货或售后寄送前，必须先通过 ${SUPPORT_EMAIL} 联系客服，并使用客服书面指定的退货地址。`,
        ],
      },
      {
        title: "运费与附加费用",
        items: [
          "运费会在结算页面或商品页面显示，最终以提交订单时显示的金额为准。",
          "因地址错误、无人签收、拒收、逾期取件导致的退回、重寄、保管等费用，由用户承担。",
          "国际干线运输、进口清关及入库成本已计入商品价格，买家结账时另付日本国内运费。",
        ],
      },
      {
        title: "合单与拆单",
        items: [
          "现货与预售同单购买时，可能等待预售到货后合并发出，也可能根据实际情况拆分发货。",
          "同一订单因到货时间或包装限制需要拆单时，可能产生多个日本国内物流单号，不重复收取已结算运费。",
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
    lead: "商品は日本の履行拠点へ一括輸入後、日本国内の配送業者より発送します。国際幹線輸送、輸入通関、入庫費用は商品価格に含まれ、日本国内送料はお届け先の都道府県に基づき計算します。",
    back: "ホームに戻る",
    sections: [
      { title: "発送目安", items: ["商品は日本の履行拠点へ一括輸入後、日本国内の配送業者より発送します。", "在庫商品：決済確認後、通常 5〜7 営業日以内に発送します。", "予約商品：商品ページ記載の発売・入荷時期を基準に、入荷後順次発送します。", "仕入、通関、物流状況により遅延する場合があります。"] },
      { title: "日本国内送料", items: ["東京都・関東・東北・信越・北陸・東海：330円。", "近畿・中国・四国：660円。北海道・九州：880円。沖縄：1,250円。", "カートで都道府県を選択すると、送料と最終支払額が表示されます。"] },
      { title: "日本履行・返品の連絡先", items: [`${JAPAN_DELIVERY_CONTACT_ADDRESS}。日本国内の履行住所ですが、事前確認なしに返品できる住所ではありません。`, `返品・アフターサポートの送付前に ${SUPPORT_EMAIL} へ連絡し、書面で指定された返品先をご利用ください。`] },
      { title: "送料・追加費用", items: ["送料は決済画面に表示されます。", "住所不備、不在、受取拒否、保管期限超過による返送・再送費用はお客様負担となります。", "国際幹線輸送、輸入通関、入庫費用は商品価格に含まれ、決済時には日本国内送料のみを別途請求します。"] },
      { title: "同梱・分割発送", items: ["在庫商品と予約商品を同時購入した場合、入荷待ちまたは分割発送となる場合があります。", "入荷時期や梱包上の理由で分割発送する場合、国内追跡番号が複数になることがありますが、決済済み送料を重複請求しません。"] },
      { title: "受取・破損時の対応", items: ["受取時に外箱の破損、水濡れ、開封跡、重量異常をご確認ください。", "問題がある場合は外箱、伝票、梱包材、商品写真、開封動画を保管し、到着後 7 日以内にご連絡ください。", "配達完了後、連続した証拠がない場合は対応が難しいことがあります。"] },
      { title: "不可抗力・遅延", items: ["天候、災害、税関検査、祝日、交通規制、メーカー延期、物流混雑等で遅延する場合があります。", "当店は追跡確認に協力しますが、管理外の遅延について追加補償はいたしかねます。"] },
    ],
  },
  en: {
    title: "Shipping & Fees",
    lead: "Products are imported to our Japan fulfillment point and delivered by a domestic carrier. International freight, import clearance, and inbound handling are included in product prices; domestic shipping is calculated by prefecture.",
    back: "Back to home",
    sections: [
      { title: "Dispatch Timing", items: ["Products are imported to our Japan fulfillment point and delivered by a domestic carrier.", "In-stock items usually ship within 5-7 business days after payment confirmation.", "Pre-orders ship after release or arrival according to the product page.", "Sourcing, customs, or carrier conditions may cause delays."] },
      { title: "Domestic Shipping", items: ["Tokyo, Kanto, Tohoku, Shinetsu, Hokuriku, and Tokai: ¥330.", "Kinki, Chugoku, and Shikoku: ¥660. Hokkaido and Kyushu: ¥880. Okinawa: ¥1,250.", "Select the delivery prefecture in the cart to see shipping and the final payment amount."] },
      { title: "Japan Fulfillment & Returns", items: [`${JAPAN_DELIVERY_CONTACT_ADDRESS}. This is our Japan fulfillment address, but it is not an unapproved return address.`, `Email ${SUPPORT_EMAIL} before any return and use only the return address provided in writing.`] },
      { title: "Shipping Fees", items: ["Domestic shipping is shown at checkout.", "Return, reshipment, or storage fees caused by wrong address, refusal, absence, or missed pickup are borne by the customer.", "International freight, import clearance, and inbound handling are included in product prices; only domestic Japanese shipping is added at checkout."] },
      { title: "Combined / Split Shipping", items: ["Orders containing both in-stock and pre-order items may wait for all items or ship separately.", "If arrival timing or packing requires split shipping, multiple domestic tracking numbers may be issued without charging the settled shipping fee twice."] },
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
