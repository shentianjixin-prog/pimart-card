import type { Lang, LegalDocContent } from "@/lib/legal/types";

const UPDATED = { zh: "2026年7月24日", ja: "2026年7月24日", en: "July 24, 2026" } as const;

function toc(lang: Lang) {
  const labels =
    lang === "zh"
      ? ["适用范围", "报价与有效期", "起订量与定金", "缺货与分配", "取消与变更", "物流税费与风险", "验收与售后", "禁止行为", "管辖与联系"]
      : lang === "ja"
        ? ["適用範囲", "見積と有効期限", "最小発注と手付", "欠品と割当", "取消と変更", "物流・税・リスク", "検収とアフター", "禁止行為", "管轄と連絡"]
        : ["Scope", "Quotes & Validity", "MOQ & Deposits", "Shortage & Allocation", "Cancel & Change", "Logistics, Tax & Risk", "Inspection & After-sales", "Prohibited Conduct", "Governing Law & Contact"];
  return labels.map((label, i) => ({ id: `b2b-${i + 1}`, label: `${String(i + 1).padStart(2, "0")} ${label}` }));
}

const zh: LegalDocContent = {
  metaTitle: "批发合作条款 | PIMART CARD",
  title: "批发合作条款",
  subtitle: "B2B / Wholesale Terms",
  updatedAt: UPDATED.zh,
  sellerChip: "事业者：{{SELLER}}",
  noticesHeading: "批发要点",
  notices: [
    { title: "批发报价需书面确认", body: "邮件或表格中的口头沟通不当然构成最终报价，最终以本站书面确认单为准。" },
    { title: "大货订单原则不可取消", body: "定金、订金、预留库存及特别采购订单，除本站同意外原则上不可取消或无理由退款。" },
    { title: "缺货按规则分配", body: "供应商削减、发行商延期或物流异常时，本站可按付款顺序、合作历史和库存情况分配。" },
    { title: "税费与清关由买方承担", body: "海外批发订单产生的关税、进口税、清关费、目的国合规责任原则上由买方承担。" },
  ],
  toc: toc("zh"),
  articles: [
    { id: "b2b-1", index: "01", title: "适用范围", blocks: [{ type: "ol", items: [
      "本条款适用于 {{SELLER}}（PIMART CARD）与店铺、经销商、采购代理、批量采购客户之间的批发、长期供货、预订配货、定期补货及其他 B2B 合作。运营负责人：{{REP}}。",
      "若双方另行签署书面合同、报价单、订单确认书或发票，其特别约定优先；未约定部分适用本条款。与面向消费者的用户协议冲突时，就 B2B 交易以本条款及书面确认为准。",
      "B2B 交易不适用面向普通消费者的无理由退换或零售促销规则。",
    ]}]},
    { id: "b2b-2", index: "02", title: "报价与有效期", blocks: [{ type: "ol", items: [
      "批发价格受库存、汇率、发行计划、市场供需、供应商条件和物流成本影响，可能随时变化。",
      "报价有效期以报价单或邮件载明为准；未载明的，原则上仅当日有效。",
      "报价不含关税、进口消费税、清关手续费、目的地本地配送费及其他第三方费用，除非报价单明确写明已包含。",
      "最终交易价格、数量、付款方式、发货安排，均以本站书面确认的订单或发票为准。",
    ]}]},
    { id: "b2b-3", index: "03", title: "起订量、定金与付款", blocks: [{ type: "ol", items: [
      "不同商品可设置最小起订量、整箱倍数、限购数量或配货比例。",
      "预售、特别采购、大货锁货或供应商预留库存订单，本站可要求支付定金、订金或全款。",
      "买方未在约定期限内付款的，本站可取消报价、释放库存或调整价格；因此造成的库存损失、汇率差或采购成本，由买方承担。",
      "除本站书面确认外，定金、订金、锁货费用和已发生的采购/物流成本原则上不退还。",
    ]}]},
    { id: "b2b-4", index: "04", title: "缺货、削减与分配", blocks: [{ type: "ol", items: [
      "若发行商、供应商、物流、清关或不可抗力导致缺货、延期、削减配额，本站可通知买方并调整发货数量、分批发货、替换商品或退款未履行部分。",
      "库存不足时，本站可综合付款时间、合作记录、订单金额、商品限制和实际到货量进行分配。",
      "缺货、削减或延期本身不构成本站对买方转售利润、机会损失、店铺信誉损失或其他间接损失的赔偿责任。",
    ]}]},
    { id: "b2b-5", index: "05", title: "取消、变更与不可抗力", blocks: [{ type: "ol", items: [
      "订单经本站确认或买方付款后，买方不得因市场价格变化、客户取消、转售失败、汇率变动或个人经营判断要求取消、退款、补差或赔偿。",
      "确需变更收货信息、发票信息、配送方式或商品数量的，应在发货前书面提出；本站有权根据实际进度决定是否接受。",
      "因地震、台风、疫情、战争、海关政策、支付机构、承运商、发行商、供应商等非本站可控因素导致无法履约的，本站可延期、分批、取消未履行部分或退款未履行部分。",
    ]}]},
    { id: "b2b-6", index: "06", title: "物流、税费与风险转移", blocks: [{ type: "ol", items: [
      "发货方式、包装方式、保险、运费和承运商以双方书面确认为准。",
      "海外订单的关税、进口税、清关费、目的国许可、标签、再销售合规及当地法规责任，原则上由买方承担。",
      "商品交付承运商后，灭失与损坏风险按书面约定或适用法律转移；物流显示妥投并不当然排除对交付瑕疵的合理核查。买方指定承运商、转运仓或自行提货的，相关风险和费用由买方承担。",
      "日本履约地址仅用于履约联络，不是未经确认的退货地址。",
    ]}]},
    { id: "b2b-7", index: "07", title: "验收、售后与举证", blocks: [{ type: "ol", items: [
      "买方应在收货后立即验货；破损、错发、漏发等问题须在签收后 7 日内书面提出。",
      "申请售后须提供订单号、箱数、外箱照片、面单、托盘/整箱照片、连续开箱视频或连续照片、问题商品照片及本站要求的其他资料。证据不足可能影响调查，但不排除适用法律或书面合同强制保留的瑕疵责任。",
      "轻微外箱压痕、封膜褶皱、行情波动、开封结果、买方二次运输/仓储造成的损坏，不属于本站售后责任。",
      "经确认属本站责任的，本站可选择补发、换货、抵扣后续货款或退还对应问题商品实付金额。",
    ]}]},
    { id: "b2b-8", index: "08", title: "禁止行为与合作终止", blocks: [
      { type: "ul", items: ["使用盗刷、欺诈、洗钱、虚假身份或来源不明资金付款。", "恶意拒付、虚假售后、伪造破损证据、调包、重封或侵犯第三方权利。", "绕过本站报价体系、攻击网站、批量抓取库存、干扰正常经营。", "违反商品权利方、目的国海关、进口、标签、销售或消费者保护法规。"] },
      { type: "callout", tone: "warn", text: "出现上述情形时，本站可暂停报价、取消未履行订单、终止合作，并依法保留追偿权利。" },
    ]},
    { id: "b2b-9", index: "09", title: "适用法律、管辖与联系", blocks: [
      { type: "p", text: "本条款（B2B）原则上适用中华人民共和国法律。双方应先友好协商；协商不成的，提交经营者所在地有管辖权的人民法院处理。若双方另有书面管辖约定，从其约定。" },
      { type: "p", text: "批发合作：{{B2B}} ｜ 客服：{{SUPPORT}}" },
    ]},
  ],
};

const ja: LegalDocContent = {
  metaTitle: "卸売条件 | PIMART CARD",
  title: "卸売・提携条件",
  subtitle: "B2B / Wholesale Terms",
  updatedAt: UPDATED.ja,
  sellerChip: "事業者：{{SELLER}}",
  noticesHeading: "卸売の要点",
  notices: [
    { title: "見積は書面確認が必要", body: "口頭や仮連絡は最終見積になりません。当店の書面確認をもって確定します。" },
    { title: "大口は原則取消不可", body: "手付・ロック在庫・特別仕入は、当店同意がない限り原則取消・無理由返金不可です。" },
    { title: "欠品時は割当", body: "メーカー削減・遅延・物流異常時は、入金順・取引実績・在庫に応じ割当できます。" },
    { title: "関税等は買主負担", body: "海外卸の関税・輸入税・通関・現地コンプライアンスは原則買主負担です。" },
  ],
  toc: toc("ja"),
  articles: [
    { id: "b2b-1", index: "01", title: "適用範囲", blocks: [{ type: "ol", items: ["本条件は {{SELLER}}（PIMART CARD）と事業者間の卸売・定期供給等 B2B に適用します。運営責任者：{{REP}}。", "別途書面がある場合は特約優先。消費者向け利用規約と矛盾する場合、B2B は本条件と書面確認を優先します。", "B2B は消費者クーリングオフの対象外です。"] }] },
    { id: "b2b-2", index: "02", title: "見積と有効期限", blocks: [{ type: "ol", items: ["価格は在庫・為替・需給等で変動します。", "有効期限未記載の場合、原則当日限りです。", "関税等は見積に含む旨の明示がない限り別途買主負担です。", "最終条件は書面確認の注文/請求に従います。"] }] },
    { id: "b2b-3", index: "03", title: "最小発注と手付", blocks: [{ type: "ol", items: ["最小ロット・箱単位・制限を設け得ます。", "予約・特別仕入は手付や全額を求め得ます。", "期限までに入金がない場合、見積取消・在庫解放・価格改定ができ、損失は買主負担です。", "手付等は書面同意がない限り原則返還しません。"] }] },
    { id: "b2b-4", index: "04", title: "欠品と割当", blocks: [{ type: "ol", items: ["欠品・遅延・削減時は数量調整・分割・代替・未履行分返金を行い得ます。", "割当は入金・実績・金額・制限・入荷量を総合します。", "転売利益等の間接損害は負いません。"] }] },
    { id: "b2b-5", index: "05", title: "取消と変更", blocks: [{ type: "ol", items: ["確認後または入金後、相場変動や転売失敗を理由とする取消は不可です。", "変更は発送前の書面申請が必要で、当店が可否を判断します。", "不可抗力時は延期・分割・未履行分取消/返金を行い得ます。"] }] },
    { id: "b2b-6", index: "06", title: "物流・税・リスク", blocks: [{ type: "ol", items: ["配送条件は書面確認に従います。", "関税・通関・現地規制は原則買主負担です。", "運送人引渡し後のリスクは約定/適用法に従い移転します。配達完了表示のみで瑕疵確認を排除しません。", "日本履行住所は無断返品先ではありません。"] }] },
    { id: "b2b-7", index: "07", title: "検収とアフター", blocks: [{ type: "ol", items: ["受取後直ちに検収し、7日以内に書面で申告してください。", "証憑として外箱・伝票・連続開封動画または連続写真等を提出。証憑不足は調査に影響し得ますが、契約/法令上の瑕疵責任を排除しません。", "軽微な外箱痕・相場・開封結果・二次輸送損傷は非対応です。", "当店責任確認後は補送・交換・相殺・該当分返金を選択できます。"] }] },
    { id: "b2b-8", index: "08", title: "禁止行為", blocks: [
      { type: "ul", items: ["不正決済・マネーロンダリング", "虚偽アフター・証拠偽造", "サイト攻撃・在庫スクレイピング", "権利者・通関・販売規制違反"] },
      { type: "callout", tone: "warn", text: "該当時は見積停止・未履行取消・提携終了ができ、求償権を留保します。" },
    ]},
    { id: "b2b-9", index: "09", title: "管轄と連絡", blocks: [
      { type: "p", text: "本条件（B2B）は原則として中華人民共和国法に準拠します。協議不調の場合は事業者所在地の管轄裁判所とします。別途書面の管轄合意がある場合はそれに従います。" },
      { type: "p", text: "卸売：{{B2B}} ｜ サポート：{{SUPPORT}}" },
    ]},
  ],
};

const en: LegalDocContent = {
  metaTitle: "Wholesale Terms | PIMART CARD",
  title: "Wholesale Terms",
  subtitle: "B2B / 卸売条件",
  updatedAt: UPDATED.en,
  sellerChip: "Operator: {{SELLER}}",
  noticesHeading: "Wholesale highlights",
  notices: [
    { title: "Quotes need written confirmation", body: "Informal chat is not a final quote; our written confirmation controls." },
    { title: "Bulk orders generally non-cancellable", body: "Deposits, locked stock and special purchases are generally non-refundable without our consent." },
    { title: "Shortage allocation", body: "On supplier cuts or delays we may allocate by payment order, history and stock." },
    { title: "Duties & clearance on buyer", body: "Overseas wholesale duties, import tax, clearance and local compliance are generally buyer’s." },
  ],
  toc: toc("en"),
  articles: [
    { id: "b2b-1", index: "01", title: "Scope", blocks: [{ type: "ol", items: ["These Terms apply to B2B wholesale between {{SELLER}} (PIMART CARD) and dealers/resellers. Person responsible: {{REP}}.", "Separate written contracts/quotes prevail. For B2B, these Terms and written confirmations prevail over consumer Terms where they conflict.", "B2B is not subject to consumer cooling-off rules."] }] },
    { id: "b2b-2", index: "02", title: "Quotes & Validity", blocks: [{ type: "ol", items: ["Prices may change with stock, FX, demand and logistics.", "If no validity is stated, quotes are same-day only by default.", "Duties and third-party fees are excluded unless expressly included.", "Final price/qty/payment/shipping follow written confirmation."] }] },
    { id: "b2b-3", index: "03", title: "MOQ & Deposits", blocks: [{ type: "ol", items: ["MOQ, case multiples and caps may apply.", "Pre-orders/special buys may require deposits or full payment.", "Late payment may cancel quotes and release stock; related losses are buyer’s.", "Deposits are generally non-refundable without written consent."] }] },
    { id: "b2b-4", index: "04", title: "Shortage & Allocation", blocks: [{ type: "ol", items: ["On shortage/delay/cuts we may adjust qty, split shipments, substitute or refund unperformed parts.", "Allocation considers payment timing, history, amount and arrivals.", "No liability for lost resale profits or similar indirect loss."] }] },
    { id: "b2b-5", index: "05", title: "Cancel & Change", blocks: [{ type: "ol", items: ["After confirmation/payment, market moves or failed resale are not cancel grounds.", "Changes require pre-shipment written request; we decide acceptance.", "Force majeure may allow delay, split, cancel or refund of unperformed parts."] }] },
    { id: "b2b-6", index: "06", title: "Logistics, Tax & Risk", blocks: [{ type: "ol", items: ["Shipping terms follow written confirmation.", "Overseas duties/clearance/local compliance are generally buyer’s.", "Risk passes per agreement/law after carrier handover; “delivered” tracking alone does not bar reasonable defect checks.", "Japan fulfillment address is not an unsupervised return address."] }] },
    { id: "b2b-7", index: "07", title: "Inspection & After-sales", blocks: [{ type: "ol", items: ["Inspect immediately; report damage/wrong/shortage in writing within 7 days.", "Provide box/label photos and continuous unboxing video or photos. Weak evidence may limit investigation but does not waive mandatory defect liability under contract/law.", "Minor box wear, market moves, pull results and buyer re-shipping damage are out of scope.", "If our responsibility is confirmed we may resend, replace, credit or refund the affected amount."] }] },
    { id: "b2b-8", index: "08", title: "Prohibited Conduct", blocks: [
      { type: "ul", items: ["Fraudulent payment / AML issues", "False claims or evidence tampering", "Attacks or inventory scraping", "Rights-holder or customs/sales-law violations"] },
      { type: "callout", tone: "warn", text: "We may suspend quotes, cancel unperformed orders, end cooperation and seek recovery." },
    ]},
    { id: "b2b-9", index: "09", title: "Governing Law & Contact", blocks: [
      { type: "p", text: "These B2B Terms are principally governed by the laws of the People’s Republic of China. Disputes should first be negotiated; failing that, submitted to a competent court at the seller’s domicile, unless a separate written jurisdiction clause applies." },
      { type: "p", text: "Wholesale: {{B2B}} | Support: {{SUPPORT}}" },
    ]},
  ],
};

export const WHOLESALE_TERMS_DOC: Record<Lang, LegalDocContent> = { zh, ja, en };
