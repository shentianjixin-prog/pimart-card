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
          "浏览商品并确认系列、语言、发售地区、现货/预售状态、价格和发货地。",
          "进入商品详情页阅读随机商品、预售、配送和售后提示后加入购物车。",
          "在购物车确认商品、数量、收货信息和费用后，跳转 Stripe 安全支付页面完成付款。",
          "支付完成后系统生成订单；本站确认库存和支付状态后安排打包发货。",
        ],
      },
      {
        title: "现货、预售与调货",
        items: [
          "现货商品：下单后按商品页与结账说明尽快安排发货，通常为 5-7 个工作日。",
          "预售商品页的「预计发货/到货」仅为参考，可能因出荷、质检、清关、物流等延迟；实际以发货为准。",
          "自首次展示的预计发货日起满 90 日仍未发货（且未发货）的，可就该商品按实付金额申请退款。",
          "同一订单包含现货和预售时，可能等待合单，也可能拆单发出。下单付款即视为已阅读并同意商品页说明与用户协议。",
        ],
      },
      {
        title: "随机商品与品相说明",
        items: [
          "补充包、盲盒、福袋、未开封盒等商品具有随机性，不保证抽中特定卡牌或达到某个市场价值。",
          "外盒轻微压痕、封膜褶皱、角部磨损、印刷差异等未影响商品识别和主要功能的情况，通常不作为退换理由。",
          "PSA/评级卡以评级机构封装和标签信息为准，本站不承诺未来复评结果或市场价格。",
        ],
      },
      {
        title: "支付与订单确认",
        items: [
          "本站通过 Stripe 处理在线信用卡支付，不保存完整卡号或安全码。",
          "订单可能因库存变动、价格明显异常、支付风险、不正使用或供应商缺货被取消并退款。",
          "请使用本人合法支付方式。盗刷、恶意拒付、虚假售后会导致账号限制。",
        ],
      },
      {
        title: "售后流程",
        items: [
          "未开封原盒、预售、随机/开封类：不适用笼统「七天无理由」；个人原因原则上不退换。",
          "可受理：运输破损、错发、漏发、明显初期不良。请于签收后 7 日内联系，并提供完整开箱视频、外箱、面单与照片。",
          "轻微外箱压痕等不影响 sealed 的，一般不视为质量问题；开封结果随机，不保证特定卡。",
          "随机结果、价格涨跌、个人喜好变化、已拆封商品及证据不足的情况，原则上不支持退换。详细规则见「用户协议」与 FAQ「售后与退换」。",
        ],
      },
    ],
    footer: { pre: "还有其他疑问？欢迎查看", contactLabel: "联系方式", orWord: "或", shippingLabel: "配送与运费", homeLabel: "返回首页", post: "继续选购。" },
  },
  ja: {
    title: "ショッピングガイド",
    sections: [
      { title: "ご購入の流れ", items: ["シリーズ、言語、発売地域、在庫/予約、価格、発送元を確認します。", "商品ページのランダム性、予約、配送、返品条件を確認してカートに追加します。", "カートで内容と配送先、費用を確認し、Stripe の安全な決済画面で支払います。", "決済完了後、在庫と支払状態を確認して発送手配を行います。"] },
      { title: "在庫・予約・取り寄せ", items: ["在庫商品は商品ページ・決済画面の案内に従い、通常 5〜7 営業日以内を目安に発送します。", "予約ページの発送/入荷予定は目安です。出荷・検品・通関・物流等で遅れる場合があり、実際の発送をもって確定します。", "初回表示の発送予定日から90日経過しても未発送の場合、当該商品の実支払額で返金申請できます。", "在庫品と予約品の同時購入は同梱または分割発送となる場合があります。"] },
      { title: "ランダム商品・コンディション", items: ["パック、ブラインド商品、福袋、未開封BOXは封入内容を保証しません。", "軽微な箱潰れ、シュリンクのしわ、角擦れ、印刷差等は原則返品理由になりません。", "PSA等の鑑定品は封入ラベルに基づき販売し、将来の再鑑定や市場価格を保証しません。"] },
      { title: "支払い・注文確認", items: ["決済は Stripe が処理し、当店はカード番号を保存しません。", "在庫変動、明らかな価格誤表示、不正利用疑い、仕入先欠品等により注文を取消し返金する場合があります。", "盗用カード、チャージバック悪用、虚偽申告はアカウント制限の対象です。"] },
      { title: "アフターサポート", items: ["未開封BOX・予約・ランダム/開封系は特殊商品で、一律のクーリングオフは適用されません。お客様都合の返品は原則不可です。", "対応可：輸送破損・誤発送・欠品・明らかな初期不良。受取後7日以内に開封動画、外箱、伝票、写真を添えてご連絡ください。", "sealedに影響しない軽い外箱痕などは原則品質問題としません。開封結果はランダムで特定カードを保証しません。", "封入結果、価格変動、好みの変化、開封済み商品、証拠不足は原則返品対象外です。詳細は利用規約と FAQ をご確認ください。"] },
    ],
    footer: { pre: "他にご質問がありますか？", contactLabel: "お問い合わせ", orWord: "または", shippingLabel: "配送・送料", homeLabel: "ホームに戻る", post: "引き続きショッピングをお楽しみください。" },
  },
  en: {
    title: "Shopping Guide",
    sections: [
      { title: "How to Buy", items: ["Check series, language, release region, stock/pre-order status, price, and origin.", "Read random item, pre-order, shipping, and return notes before adding to cart.", "Review your cart, address, and fees, then pay securely via Stripe.", "After payment, we confirm stock/payment status and arrange dispatch."] },
      { title: "Stock, Pre-orders & Backorders", items: ["In-stock items ship as soon as practical per the product page and checkout notes, usually within 5-7 business days.", "Pre-order estimated ship/arrival dates are references only and may slip due to production, QC, customs, suppliers, or carriers; actual ship date controls.", "If still unshipped 90 days after the first displayed estimate, you may request a refund of that item's amount paid.", "Orders containing in-stock and pre-order items may ship together or separately."] },
      { title: "Random Items & Condition", items: ["Packs, blind items, lucky bags, and sealed boxes do not guarantee specific pulls or value.", "Minor box dents, shrink wrinkles, corner wear, or print differences are usually not return reasons.", "Graded cards are sold based on the slab and label; future regrading or market value is not guaranteed."] },
      { title: "Payment & Order Review", items: ["Payments are processed by Stripe; we do not store full card numbers.", "Orders may be cancelled and refunded for stock changes, obvious pricing errors, payment risk, misuse, or supplier shortage.", "Stolen cards, abusive chargebacks, and false claims may lead to account restrictions."] },
      { title: "After-sales", items: ["Sealed boxes, pre-orders, and random/open-pack items are special categories; no blanket no-reason returns, and preference returns are generally declined.", "Eligible: transit damage, wrong/missing item, or obvious initial defect. Contact within 7 days of delivery with a full unboxing video, outer box, label, and photos.", "Minor box dents that do not break the seal are usually not defects; pulls are random and specific cards are not guaranteed.", "Pull results, price changes, preference changes, opened items, or insufficient evidence are generally not eligible for return. See Terms of Use and FAQ Returns for full rules."] },
    ],
    footer: { pre: "Have more questions?", contactLabel: "Contact Us", orWord: "or", shippingLabel: "Shipping & Fees", homeLabel: "Back to Home", post: "to continue browsing." },
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
