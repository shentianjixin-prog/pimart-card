import Link from "next/link";
import { cookies } from "next/headers";
import { SUPPORT_EMAIL } from "@/lib/site";
import { resolveLang } from "@/lib/translations";

type FaqItem = { q: string; a: string[]; id?: string };

const DATA: Record<"zh" | "ja" | "en", { title: string; contactPre: string; contactLabel: string; items: FaqItem[] }> = {
  zh: {
    title: "常见问题",
    contactPre: "还有其他问题？请通过",
    contactLabel: "联系我们",
    items: [
      { q: "PIMART CARD 是官方店铺吗？", a: ["本站销售正版集换式卡牌、未开封盒和周边商品，但不是宝可梦、万代、集英社、PSA 等权利方或评级机构的官方授权店铺。商品名和商标仅用于识别商品。"] },
      { q: "商品一定能抽到热门卡或隐藏款吗？", a: ["不能。补充包、盲盒、福袋、未开封盒等商品具有随机性，本站不保证特定卡牌、隐藏款、签名卡、保底结果或二级市场价值。抽卡结果不能作为退换或补偿理由。"] },
      { q: "外盒有轻微压痕或封膜褶皱可以退吗？", a: ["集换式卡牌商品在生产、运输和仓储中可能出现轻微外盒压痕、角部磨损、封膜褶皱或印刷差异。未影响商品识别和主要功能的轻微外观差异，原则上不作为退换理由。"] },
      { q: "预售商品延期怎么办？", a: ["预售商品受发行商、供应商、物流和通关影响，可能延期或分批到货。本站会尽量更新信息并按订单顺序发货；除本站取消订单外，预售延期本身通常不产生额外赔偿。"] },
      { q: "收到破损、错发或少件怎么办？", id: "returns", a: ["请在收货后 7 日内联系本站，并提供订单号、物流单号、外箱照片、面单照片、商品照片和开箱视频或连续照片。请勿在未获得确认前丢弃包装或自行寄回商品。", "经确认属于本站责任的，我们会根据库存和问题程度安排补发、换货、部分退款或退款。"] },
      { q: "可以因为价格下跌或买贵了取消订单吗？", a: ["集换式卡牌存在市场价格波动。订单支付后，用户不得因市场价格涨跌、个人判断变化或其他平台价格不同要求取消、补差或赔偿。"] },
      { q: "卡牌买取的线上报价就是最终价格吗？", a: ["不是。线上沟通或表单中的价格仅供参考，最终査定以本站收到实物后对真伪、版本、语言、品相、市场流动性和库存需求的判断为准。疑似假货、重封、盗品或来源不明商品可能被拒收。"] },
      { q: "为什么账号或订单会被限制？", a: ["多账号占库存、批量注册、脚本请求、恶意拒付、盗刷嫌疑、虚假售后、异常下单、绕过系统限制或利用漏洞等行为，都可能导致订单取消、账号限制或进一步核验。"] },
    ],
  },
  ja: {
    title: "よくある質問",
    contactPre: "その他のご質問は",
    contactLabel: "お問い合わせ",
    items: [
      { q: "PIMART CARD は公式ショップですか？", a: ["当店は正規品のカード・未開封BOX・関連商品を販売していますが、各権利者、メーカー、PSA等の公式ショップではありません。"] },
      { q: "特定のカードや当たりを保証しますか？", a: ["保証しません。パック、ブラインド商品、福袋、未開封BOXはランダム性があり、封入結果や市場価値を理由とした返品・補償はできません。"] },
      { q: "箱潰れやシュリンクのしわは返品対象ですか？", a: ["軽微な箱潰れ、角擦れ、シュリンクのしわ、印刷差等は、商品識別や主要機能に影響しない限り原則返品対象外です。"] },
      { q: "予約商品が遅れた場合は？", a: ["メーカー、仕入先、通関、物流の事情により遅延または分納となる場合があります。当店は状況に応じて順次発送しますが、遅延自体は原則補償対象外です。"] },
      { q: "破損・誤配送・不足があった場合は？", id: "returns", a: ["到着後 7 日以内に注文番号、追跡番号、外箱、伝票、商品写真、開封動画等を添えてご連絡ください。梱包材は確認完了まで保管してください。", "当店責任と確認できた場合、在庫状況に応じて再送、交換、一部返金または返金で対応します。"] },
      { q: "価格下落を理由にキャンセルできますか？", a: ["カード商品は相場変動があります。注文確定後、市場価格の上下や他店価格を理由としたキャンセル、差額補償はできません。"] },
      { q: "買取の事前案内価格は確定価格ですか？", a: ["確定ではありません。最終査定は実物到着後、真贋、状態、言語、バージョン、相場、在庫需要により決定します。"] },
      { q: "アカウントや注文が制限される理由は？", a: ["複数アカウント、在庫占有、bot、チャージバック悪用、不正利用疑い、虚偽申告、システム回避等が確認された場合、注文取消やアカウント制限の対象となります。"] },
    ],
  },
  en: {
    title: "FAQ",
    contactPre: "Have another question? Please",
    contactLabel: "contact us",
    items: [
      { q: "Is PIMART CARD an official store?", a: ["We sell authentic cards, sealed boxes, and related goods, but we are not an official store of the rights holders, publishers, manufacturers, or grading companies."] },
      { q: "Do you guarantee specific pulls?", a: ["No. Packs, blind items, lucky bags, and sealed boxes are random. Pull results or market value are not grounds for return or compensation."] },
      { q: "Can I return an item for minor box dents?", a: ["Minor box dents, shrink wrinkles, corner wear, or print differences are generally not return reasons unless they affect product identification or core function."] },
      { q: "What if a pre-order is delayed?", a: ["Pre-orders may be delayed or split due to publishers, suppliers, customs, or carriers. We ship in order when items arrive, but delay itself is generally not compensated."] },
      { q: "What if an item is damaged, wrong, or missing?", id: "returns", a: ["Contact us within 7 days with order number, tracking number, photos of box/label/item, and opening video or continuous photos. Keep all packaging until we confirm.", "If confirmed as our responsibility, we may resend, replace, partially refund, or refund depending on stock and issue severity."] },
      { q: "Can I cancel because the market price changed?", a: ["No. Card prices fluctuate. After payment, price changes, preference changes, or other stores' prices are not grounds for cancellation or compensation."] },
      { q: "Is the buyback estimate final?", a: ["No. Final appraisal depends on authenticity, condition, language, version, market liquidity, and inventory demand after we receive the item."] },
      { q: "Why may my account or order be restricted?", a: ["Multiple accounts, stock hoarding, bots, abusive chargebacks, suspected fraud, false claims, and system circumvention may lead to order cancellation or account restrictions."] },
    ],
  },
};

export default async function FaqPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const d = DATA[lang];

  return (
    <div className="section-tone-sky mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="section-title">{d.title}</h1>
      <div className="mt-8 space-y-4">
        {d.items.map((item) => (
          <div key={item.q} id={item.id} className="surface scroll-mt-24 p-6">
            <h2 className="text-base font-semibold text-[#111827]">{item.q}</h2>
            {item.a.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[#6b7280]">
        {d.contactPre}{" "}
        <Link href="/contact" className="mx-1 font-medium text-[#111827] hover:underline">
          {d.contactLabel}
        </Link>
        {lang === "en" ? "." : "。"}{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-[#111827] hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  );
}
