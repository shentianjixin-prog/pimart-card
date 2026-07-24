import { PAYMENT_METHODS } from "@/lib/site";
import type { Lang, TokushoDocContent } from "@/lib/legal/types";

const UPDATED = { zh: "2026年7月24日", ja: "2026年7月24日", en: "July 24, 2026" } as const;

function build(lang: Lang): TokushoDocContent {
  if (lang === "zh") {
    return {
      metaTitle: "特定商取引法表記 | PIMART CARD",
      title: "特定商取引法に基づく表記",
      subtitle: "特定商业交易法披露 / Specified Commercial Transaction Act Disclosure",
      updatedAt: UPDATED.zh,
      sellerChip: "销售业者：{{SELLER}}",
      noticesHeading: "重要提示",
      notices: [
        { number: "01", title: "个人原因退换原则不接受", body: "未开封原盒、预售、随机/开封类等为特殊商品，不适用笼统冷静期。" },
        { number: "02", title: "可疑订单可取消", body: "多账号、bot、盗刷、恶意拒付等情形，本站可取消订单。" },
      ],
      rows: [
        { id: "tk-seller", label: "销售业者", value: "{{SELLER}}" },
        { id: "tk-rep", label: "运营负责人", value: "{{REP}}" },
        { id: "tk-cn-rep", label: "中国地区负责人", value: "{{CHINA_REP}}" },
        { id: "tk-addr", label: "经营者所在地", value: "{{ADDRESS}}" },
        { id: "tk-japan-delivery", label: "日本国内履约地址", value: "{{JP_ADDRESS}}\n※非销售主体所在地。退货前请联系 {{SUPPORT}}，并使用书面指定退货地址。" },
        { id: "tk-phone", label: "电话", value: "{{PHONE}}（中国）\n※请优先使用邮件联系" },
        { id: "tk-email", label: "邮箱", value: "{{SUPPORT}}\n※通常 2 个工作日内回复" },
        { id: "tk-price", label: "销售价格", value: "以各商品页日元（JPY）显示为准。税费处理以商品页与结账页为准。价格可能随市场、库存、汇率、采购条件变动。" },
        { id: "tk-extra", label: "商品价款以外的必要费用", value: "日本国内运费：东京都・关东・东北・信越・北陆・东海 ¥330／近畿・中国・四国 ¥660／北海道・九州 ¥880／冲绳 ¥1,250\n国际干线运输・进口清关・入库费用：已计入商品价格\n支付手续费：视支付方式，以 Stripe 显示为准\n再配送・退回・保管费：因客户事由产生的由客户承担" },
        { id: "tk-pay", label: "支付方式", value: `${PAYMENT_METHODS.zh}\n※可用方式因国家/地区、设备及 Stripe 提供情况而异。` },
        { id: "tk-timing", label: "支付时期", value: "订单确认时即时结算。预售商品亦于下单时结算。" },
        { id: "tk-delivery", label: "商品交付时期", value: "商品统一进口至日本履约点后，由日本国内承运商发货。\n【现货】支付确认后通常 5〜7 个工作日内发货\n【预售・调货】页面显示时间为参考，实际以发货日为准\n※自首次展示预计发货日起满 90 日仍未发货的，可就该商品申请按实付退款（仅标到「某月」的以该月末起算）" },
        { id: "tk-valid", label: "申请有效期限", value: "缺货、价格误标、支付错误、可疑订单、供应商原因等情形下，本站可取消订单并退还已收款。" },
        {
          id: "tk-returns",
          label: "退货・换货",
          blocks: [
            { title: "客户事由", body: "客户事由的退换原则不接受（无一律冷静期）。未开封原盒・预售・随机/开封类为特殊商品。下单付款即视为同意商品页与用户协议。" },
            { title: "可受理情形", body: "运输破损致商品实质受损、错发、漏发、明显初期不良，且能合理证明问题在签收时已存在。" },
            { title: "不受理示例", body: "喜好变化、买多了、行情波动、开封结果不满、不影响 sealed 的轻微外箱压痕、客户二次包装/转运/保管不当造成的损坏。" },
            { title: "申请期限・证据", body: `请于签收后 7 日内联系 {{SUPPORT}}，并提供订单号、运单、外箱、包装材料、商品状态照片或连续开箱视频/连续照片。证据不足或逾期可能影响处理，但不排除适用法律强制保留的权利。` },
            { title: "处理方式", body: "经确认属本站责任的，优先补发/换货；无库存则退还该商品实付。不接受到付退货。退货地址以客服书面指示为准。" },
          ],
        },
        { id: "tk-cancel", label: "取消", value: "订单成立后，客户事由取消原则不可。本站另行同意或本表記/用户协议特别条款除外。" },
        { id: "tk-limit", label: "销售数量限制", value: "商品可设购买数量限制。多账号、转卖目的大量下单或可疑利用时，可取消订单。" },
        { id: "tk-buyback", label: "买取服务", value: "目前买取功能已停止，不接受申请、收货、估价或收集身份/账户资料。" },
        { id: "tk-ip", label: "商标说明", value: "本站非各卡牌游戏、出版社、厂商、权利人的官方店铺。商品名与商标归权利人所有，仅用于识别商品。" },
      ],
    };
  }

  if (lang === "ja") {
    return {
      metaTitle: "特定商取引法に基づく表記 | PIMART CARD",
      title: "特定商取引法に基づく表記",
      subtitle: "特定商业交易法披露 / Specified Commercial Transaction Act Disclosure",
      updatedAt: UPDATED.ja,
      sellerChip: "販売業者：{{SELLER}}",
      noticesHeading: "重要なお知らせ",
      notices: [
        { number: "01", title: "お客様都合の返品は原則不可", body: "未開封BOX・予約・ランダム/開封系は特殊商品です。クーリングオフの一律適用はありません。" },
        { number: "02", title: "不正注文は取消対象", body: "複数アカウント、bot、盗用カード、チャージバック悪用等が疑われる場合、注文を取消すことがあります。" },
      ],
      rows: [
        { id: "tk-seller", label: "販売業者", value: "{{SELLER}}" },
        { id: "tk-rep", label: "運営責任者", value: "{{REP}}" },
        { id: "tk-cn-rep", label: "中国地域責任者", value: "{{CHINA_REP}}" },
        { id: "tk-addr", label: "事業者所在地", value: "{{ADDRESS}}" },
        { id: "tk-japan-delivery", label: "日本国内履行住所", value: "{{JP_ADDRESS}}\n※販売業者の所在地ではありません。返品前に {{SUPPORT}} へ連絡し、書面で指定された返品先をご利用ください。" },
        { id: "tk-phone", label: "電話番号", value: "{{PHONE}}（中国）\n※お問い合わせはメールを優先してください" },
        { id: "tk-email", label: "メールアドレス", value: "{{SUPPORT}}\n※通常２営業日以内にご返信します" },
        { id: "tk-price", label: "販売価格", value: "各商品ページに日本円（JPY）で表示します。税の取扱いは商品ページ・決済画面の表示に従います。" },
        { id: "tk-extra", label: "商品代金以外の必要料金", value: "日本国内送料：東京都・関東・東北・信越・北陸・東海 330円／近畿・中国・四国 660円／北海道・九州 880円／沖縄 1,250円\n国際幹線輸送・輸入通関・入庫費用：商品価格に含む\n決済手数料：Stripe表示に従う\n再配送・返送・保管料：お客様事由の場合はお客様負担" },
        { id: "tk-pay", label: "支払方法", value: `${PAYMENT_METHODS.ja}\n※利用可能な方法は国・地域、端末および Stripe の提供状況により異なります。` },
        { id: "tk-timing", label: "支払時期", value: "注文確定時に即時決済。予約商品も注文時決済となります。" },
        { id: "tk-delivery", label: "商品の引渡時期", value: "商品は日本の履行拠点へ一括輸入後、日本国内の配送業者より発送します。\n【現物】決済確認後 5〜7 営業日を目安に発送\n【予約・取り寄せ】表示予定は目安。実際の発送日をもって確定\n※初回表示の発送予定日から90日経過しても未発送の場合、当該商品の実支払額で返金申請可" },
        { id: "tk-valid", label: "申込の有効期限", value: "在庫切れ、価格誤表示、決済エラー、不正注文の疑い、仕入先都合等がある場合、当店は注文を取消し、受領済み代金を返金できます。" },
        {
          id: "tk-returns",
          label: "返品・交換について",
          blocks: [
            { title: "お客様都合", body: "お客様都合の返品・交換は原則お受けできません。未開封BOX・予約・ランダム/開封系は特殊商品です。" },
            { title: "対応可能な場合", body: "輸送破損により商品本体に実質的損害がある、誤発送、欠品、明らかな初期不良など、受取時点で生じていたことが合理的に示せる場合。" },
            { title: "対応できない例", body: "好みの変更、買過ぎ、相場変動、開封結果への不満、sealedに影響しない軽い外箱痕、二次梱包・保管不良による損傷。" },
            { title: "申請期限・証憑", body: `受取後7日以内に {{SUPPORT}} までご連絡ください。注文番号、伝票、外箱、梱包材、商品状態が分かる写真または連続開封動画/連続写真を添付。証憑不足は対応に影響し得ますが、法令上排除できない権利は失われません。` },
            { title: "対応方法", body: "当店都合と認める場合は補送・交換を優先し、在庫がない場合は実支払額を返金します。着払い返品不可。返送先は書面指示に従い、履行住所への無断返送は不可です。" },
          ],
        },
        { id: "tk-cancel", label: "キャンセルについて", value: "注文成立後のお客様都合キャンセルは原則不可。" },
        { id: "tk-limit", label: "販売数量の制限", value: "商品ごとに購入数量制限を設ける場合があります。不正利用が疑われる場合、注文を取消すことがあります。" },
        { id: "tk-buyback", label: "買取サービス", value: "現在、買取機能は停止しています。" },
        { id: "tk-ip", label: "表現および商標", value: "当店は各権利者の公式ショップではありません。商標は各権利者に帰属します。" },
      ],
    };
  }

  return {
    metaTitle: "Specified Commercial Transactions Notice | PIMART CARD",
    title: "Specified Commercial Transactions Act Disclosure",
    subtitle: "特定商取引法に基づく表記 / 特定商业交易法披露",
    updatedAt: UPDATED.en,
    sellerChip: "Seller: {{SELLER}}",
    noticesHeading: "Important notices",
    notices: [
      { number: "01", title: "No cooling-off for special goods", body: "Sealed boxes, pre-orders and random/openable goods are generally non-returnable for personal reasons." },
      { number: "02", title: "Suspicious orders may be cancelled", body: "Multi-accounting, bots, stolen cards or abusive chargebacks may lead to cancellation." },
    ],
    rows: [
      { id: "tk-seller", label: "Seller", value: "{{SELLER}}" },
      { id: "tk-rep", label: "Person responsible", value: "{{REP}}" },
      { id: "tk-cn-rep", label: "China regional contact", value: "{{CHINA_REP}}" },
      { id: "tk-addr", label: "Seller address", value: "{{ADDRESS}}" },
      { id: "tk-japan-delivery", label: "Japan fulfillment address", value: "{{JP_ADDRESS}}\nNot the seller’s registered address. Contact {{SUPPORT}} before any return; use only the written return address." },
      { id: "tk-phone", label: "Phone", value: "{{PHONE}} (China)\nEmail preferred" },
      { id: "tk-email", label: "Email", value: "{{SUPPORT}}\nUsually within 2 business days" },
      { id: "tk-price", label: "Selling price", value: "Shown in JPY on each product page. Tax treatment follows product/checkout display. Prices may change with market, stock, FX and sourcing." },
      { id: "tk-extra", label: "Fees besides product price", value: "Domestic Japan shipping: Tokyo/Kanto/Tohoku/Shinetsu/Hokuriku/Tokai ¥330; Kinki/Chugoku/Shikoku ¥660; Hokkaido/Kyushu ¥880; Okinawa ¥1,250\nInternational freight/clearance/inbound: included in product price\nPayment fees: per Stripe\nReship/return/storage: buyer-caused fees borne by buyer" },
      { id: "tk-pay", label: "Payment methods", value: `${PAYMENT_METHODS.en}\nAvailability varies by country, device and Stripe.` },
      { id: "tk-timing", label: "Payment timing", value: "Charged when the order is confirmed. Pre-orders are also charged at order time." },
      { id: "tk-delivery", label: "Delivery timing", value: "Imported to Japan fulfillment then shipped domestically.\nIn-stock: usually 5–7 business days after payment confirmation\nPre-order/backorder: dates are estimates; actual dispatch date controls\nIf unshipped 90 days after first displayed estimate, refund of amounts paid for that item may be requested" },
      { id: "tk-valid", label: "Application validity", value: "We may cancel and refund for shortage, mispricing, payment errors, suspected abuse or supplier issues." },
      {
        id: "tk-returns",
        label: "Returns & exchanges",
        blocks: [
          { title: "Buyer convenience", body: "Generally not accepted. Sealed/pre-order/random goods are special." },
          { title: "Eligible cases", body: "Transit damage to the product, wrong item, shortage, clear initial defect reasonably shown at receipt." },
          { title: "Not eligible", body: "Change of mind, market moves, pull results, minor box wear not affecting sealed integrity, damage from buyer repacking/storage." },
          { title: "Deadline & evidence", body: `Contact {{SUPPORT}} within 7 days with order/tracking, box/label photos, and continuous unboxing video or photos. Weak evidence may limit handling; non-excludable statutory rights remain.` },
          { title: "Remedies", body: "If our responsibility is confirmed: resend/replace preferred; otherwise refund item amount paid. No COD returns. Return only to the written address we provide." },
        ],
      },
      { id: "tk-cancel", label: "Cancellation", value: "Buyer convenience cancels after formation are generally not allowed except as we agree in writing or special clauses apply." },
      { id: "tk-limit", label: "Quantity limits", value: "Per-item limits may apply. Suspected multi-account or abuse may lead to cancellation." },
      { id: "tk-buyback", label: "Buyback", value: "Buyback is currently paused." },
      { id: "tk-ip", label: "Trademarks", value: "We are not an official store of rights holders. Names/marks are used for identification only." },
    ],
  };
}

export const TOKUSHO_DOC: Record<Lang, TokushoDocContent> = {
  zh: build("zh"),
  ja: build("ja"),
  en: build("en"),
};
