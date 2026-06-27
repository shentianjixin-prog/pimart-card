export const metadata = {
  title: "特定商取引法に基づく表記 | PIMART CARD",
};

const rows: [string, string][] = [
  ["販売業者", "神田紀信（KD商事）"],
  ["代表責任者", "神田紀信"],
  ["所在地", "東京都板橋区弥生町１－２ ステラコート１０６"],
  [
    "電話番号",
    "070-2226-1876\n※お問い合わせはメールを優先してください",
  ],
  [
    "メールアドレス",
    "shentianjixin@gmail.com\n※通常２営業日以内に返信いたします",
  ],
  ["販売価格", "各商品ページに記載の価格（税込）"],
  [
    "商品代金以外の費用",
    "送料：注文画面または商品ページに表示\n関税：中国直送の場合、受取時に関税が発生する場合があります（お客様負担）",
  ],
  ["支払方法", "クレジットカード（Visa / Mastercard / JCB）"],
  ["支払時期", "注文確定時にクレジットカードにて即時決済"],
  [
    "商品の引渡時期",
    "【日本国内倉庫発送】注文確定後３営業日以内に発送\n【中国より海外直送】注文確定後７〜１４営業日で発送\n※商品ページに発送元が記載されています",
  ],
  [
    "返品・交換について",
    "トレーディングカードパック・ブラインドボックス等の商品性質上、\n注文確定後のキャンセル・返品・交換はお受けできません。\n\n商品の初期不良・破損・誤送品の場合に限り、\n到着後７日以内にメール（shentianjixin@gmail.com）にて\n写真をご添付の上ご連絡ください。確認後、対応いたします。",
  ],
];

export default function TokushoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-white">
        特定商取引法に基づく表記
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Specified Commercial Transaction Act Disclosure
      </p>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/10">
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th className="w-36 bg-white/5 px-4 py-3 text-left align-top font-medium text-gray-300">
                  {label}
                </th>
                <td className="whitespace-pre-line px-4 py-3 text-gray-400">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-gray-600">
        最終更新：2026年6月27日
      </p>
    </div>
  );
}
