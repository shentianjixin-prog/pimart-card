import {
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_REPRESENTATIVE,
  COMPANY_SELLER,
  SUPPORT_EMAIL,
} from "@/lib/site";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "特定商取引法に基づく表記 | PIMART CARD",
};

/** 表記項目対齐 SNKRDUNK 特商法骨格 + 会员购售后边界，适配本站直邮店铺 */

type Row =
  | { id: string; label: string; value: string }
  | {
      id: string;
      label: string;
      blocks: { title: string; body: string }[];
    };

const ROWS: Row[] = [
  { id: "tk-seller", label: "販売業者", value: COMPANY_SELLER },
  { id: "tk-rep", label: "代表責任者", value: COMPANY_REPRESENTATIVE },
  { id: "tk-addr", label: "所在地", value: COMPANY_ADDRESS },
  {
    id: "tk-phone",
    label: "電話番号",
    value: `${COMPANY_PHONE}\n※お問い合わせはメールを優先してください（電話対応は行っておりません）`,
  },
  {
    id: "tk-email",
    label: "メールアドレス",
    value: `${SUPPORT_EMAIL}\n※通常２営業日以内にご返信します`,
  },
  { id: "tk-price", label: "販売価格", value: "各商品ページに税込価格を表示" },
  {
    id: "tk-extra",
    label: "商品代金以外の必要料金",
    value:
      "送料：注文画面または商品ページに表示\n決済手数料：決済手段により発生する場合あり（Stripe表示に従う）\n関税・消費税・通関手数料：海外配送時はお客様負担\n返送料：お客様都合またはお客様事由による場合はお客様負担",
  },
  {
    id: "tk-pay",
    label: "支払方法",
    value: "クレジットカード（Visa / Mastercard / JCB 等、Stripe対応）",
  },
  { id: "tk-timing", label: "支払時期", value: "注文確定時に即時決済" },
  {
    id: "tk-delivery",
    label: "商品の引渡時期",
    value:
      "【現物】商品ページ・決済画面の案内に従い発送\n【予約】表示の発送/入荷予定は目安。出荷・検品・通関・配送等により遅延する場合があり、実際の発送日をもって確定\n※初回表示の発送予定日から90日経過しても未発送の場合、当該商品の実支払額で返金申請可（予定が「月」のみの場合は当該月末起算）",
  },
  {
    id: "tk-returns",
    label: "返品・交換について",
    blocks: [
      {
        title: "お客様都合",
        body: "お客様都合の返品・交換は原則お受けできません（クーリングオフの一律適用はありません）。未開封BOX・予約・ランダム/開封系は特殊商品です。ご注文・お支払いをもって商品ページと利用規約に同意したものとみなします。",
      },
      {
        title: "対応可能な場合",
        body: "輸送破損により商品本体に実質的損害がある、誤発送、欠品など、受取時点で生じていたことが合理的に示せる場合。",
      },
      {
        title: "対応できない例",
        body: "好みの変更、買過ぎ、相場変動、開封結果への不満、sealedに影響しない軽い外箱痕・角傷、お客様の二次梱包・転送・保管不良による損傷。",
      },
      {
        title: "申請期限・証憑",
        body: `受取後7日以内に ${SUPPORT_EMAIL} までご連絡ください。注文番号、開封動画（未開封外装から開封まで連続撮影推奨）、写真を添付。証憑不足・期限超過はお受けできないことがあります。`,
      },
      {
        title: "対応方法",
        body: "当店都合と認める場合は補送・交換を優先し、在庫がない場合は当該商品の実支払額を返金します。着払い返品不可。返送品は当店着荷までのリスクはお客様負担。返送指示後7日以内に発送し追跡番号をご連絡ください。",
      },
    ],
  },
  {
    id: "tk-cancel",
    label: "キャンセルについて",
    value:
      "注文成立後のお客様都合キャンセルは原則不可。当店が別途認める場合、または本表記・利用規約の特別条項に該当する場合を除きます。",
  },
];

const TOC = ROWS.map((row, i) => ({
  id: row.id,
  label: `${String(i + 1).padStart(2, "0")} ${row.label}`,
}));

const KEY_NOTICES = [
  {
    title: "お客様都合の返品は原則不可",
    body: "未開封BOX・予約・ランダム/開封系は特殊商品です。クーリングオフの一律適用はありません。",
  },
  {
    title: "受取後7日以内にご連絡",
    body: "輸送破損・誤発送・欠品は、開封動画と写真を添えてサポートへご連絡ください。",
  },
  {
    title: "予約は90日未発送で返金可",
    body: "初回表示の発送予定日から90日経過しても未発送の場合、実支払額で返金申請できます。",
  },
];

export default function TokushoPage() {
  return (
    <LegalPageShell
      active="tokusho"
      title="特定商取引法に基づく表記"
      subtitle="Specified Commercial Transaction Act Disclosure"
      updatedAt="2026年7月13日"
      sellerLabel={`販売業者：${COMPANY_SELLER}`}
      toc={TOC}
      notices={<LegalKeyNotices heading="重要なお知らせ" items={KEY_NOTICES} />}
    >
      <dl className="legal-dl">
        {ROWS.map((row) => (
          <div key={row.id} id={row.id} className="legal-dl-row scroll-mt-28">
            <dt className="legal-dl-label">{row.label}</dt>
            <dd className="legal-dl-value">
              {"blocks" in row ? (
                <div className="legal-dl-blocks">
                  {row.blocks.map((block) => (
                    <div key={block.title}>
                      <p className="legal-dl-block-title">{block.title}</p>
                      <p className="legal-dl-block-body">{block.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </LegalPageShell>
  );
}
