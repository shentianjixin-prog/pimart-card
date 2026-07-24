import type { Lang, LegalDocContent } from "@/lib/legal/types";

const UPDATED = {
  zh: "2026年7月24日",
  ja: "2026年7月24日",
  en: "July 24, 2026",
} as const;

function toc(lang: Lang) {
  const labels =
    lang === "zh"
      ? ["总则与购前同意", "账户与资格", "商品与价格", "订单与取消", "支付与风控", "发货与签收", "预售延期退款", "特殊品类", "售后与举证", "随机性与品相", "买取暂停", "禁止行为", "免责范围", "协议变更", "管辖与联系"]
      : lang === "ja"
        ? ["総則と購入前同意", "アカウント", "商品と価格", "注文と取消", "決済とリスク管理", "発送と受取", "予約遅延の返金", "特殊商品", "アフターサポート", "ランダム性と状態", "買取停止", "禁止行為", "免責", "規約変更", "管轄と連絡"]
        : ["General & Consent", "Accounts", "Products & Pricing", "Orders & Cancellation", "Payment & Risk", "Shipping & Receipt", "Pre-order Delay Refund", "Special Goods", "After-sales & Evidence", "Randomness & Condition", "Buyback Paused", "Prohibited Conduct", "Liability Limits", "Changes", "Governing Law & Contact"];
  return labels.map((label, i) => ({
    id: `art-${i + 1}`,
    label: `${String(i + 1).padStart(2, "0")} ${label}`,
  }));
}

const zh: LegalDocContent = {
  metaTitle: "用户协议 | PIMART CARD",
  title: "用户协议",
  subtitle: "利用規約 / Terms of Use",
  updatedAt: UPDATED.zh,
  sellerChip: "运营主体：{{SELLER}}",
  noticesHeading: "购前关键须知",
  notices: [
    { title: "下单即视为同意本协议", body: "浏览、加购、提交订单并完成付款，即视为已阅读、理解并同意本协议、商品页说明及当时有效规则。" },
    { title: "特殊品不适用笼统七天无理由", body: "未开封原盒、补充包、预售、随机/开封类等特殊商品，个人原因退换原则不接受。" },
  ],
  toc: toc("zh"),
  articles: [
    {
      id: "art-1", index: "01", title: "总则与购前同意",
      blocks: [{
        type: "ol",
        items: [
          "本协议是您与 {{SELLER}}（以下简称「本站」）之间，就使用 PIMART CARD 网站、购买商品及使用相关服务所订立的具有约束力的协议。运营负责人：{{REP}}。",
          "不同商品适用不同售后政策（现货 / 预售 / 未开封原盒 / 随机商品等），将在商品详情页及本协议、特定商取引法表記、售后说明中公示。不一致时，以商品页特别说明优先；商品页未说明的，以本协议为准。",
          "您浏览商品、加入购物车、提交订单并完成付款，即视为已阅读、理解并同意本协议及当时有效的全部相关规则。如不同意，请勿下单。",
          "本站非各 IP（宝可梦、海贼王等）官方授权零售商；所售为正版流通商品，商标归权利人所有。",
        ],
      }],
    },
    {
      id: "art-2", index: "02", title: "账户与使用资格",
      blocks: [{
        type: "ol",
        items: [
          "您应提供真实、准确、完整的注册、支付与收货信息，并及时更新。",
          "账号、密码、邮箱验证码及登录状态由您自行保管；通过您的账号发生的操作，原则上视为您的行为。",
          "因您提供错误地址、联系方式或拒不配合核实导致无法履约的，本站有权取消订单或暂停发货，相关损失由您承担。",
          "未成年人应在监护人同意下使用本站服务；监护人应对相关行为负责。",
          "同一用户不得通过多账号、虚假资料、自动化脚本、恶意占库存、刷单、薅活动、恶意拒付或倒卖系统漏洞等方式影响本站正常经营。",
          "本站有权在合理怀疑欺诈、滥用优惠、恶意退换、扰乱经营、盗刷、洗钱或绕过风控等情形时，限制账号、取消订单、暂停发货或要求补充身份与交易证明。",
        ],
      }],
    },
    {
      id: "art-3", index: "03", title: "商品信息、库存与价格",
      blocks: [{
        type: "ol",
        items: [
          "商品名称、图片、价格、库存、发货说明以商品页及结账页展示为准。图片仅为示意，实物品相以 sealed / 评级状态及页面说明为准。",
          "价格以日元（JPY）标示；税费是否含税以页面标注为准。结账金额以 Stripe 支付页最终显示为准。",
          "商品图片、翻译、系列名称、发售日、稀有度、市场参考价等信息仅用于帮助识别商品，最终以商品实物、发行商公开信息及商品页面明确标注为准。",
          "集换式卡牌和未开封商品存在行情波动。本站**不对商品是否满足您的特定收藏目标、投资收益、转售利润或其他特定目的**作任何明示或默示担保。",
          "二级市场行情仅供参考，不构成投资建议，亦不作为退换货、取消订单、补差或赔偿依据。",
          "因系统错误、库存同步延迟、供应商缺货、价格明显异常、支付异常或不可抗力导致订单无法履行时，本站可取消订单并退还已支付款项。",
        ],
      }],
    },
    {
      id: "art-4", index: "04", title: "订单成立、缺货与取消",
      blocks: [{
        type: "ol",
        items: [
          "您提交订单并完成付款后，除本协议另有约定外，合同成立。",
          "因市场波动、供应商计划变更、系统故障、不可抗力等，可能出现缺货。本站将尽快通知您，并可采取取消订单并退还实付金额、协商换货/调货等方案。",
          "订单成立后，除本站书面同意或本协议特别约定外，您不得单方取消。",
          "付款完成后，除本协议明确列明的可退款情形外，**原则上不支持退款**。",
          "预售、随机、补充包、未开封盒、限量商品及个人订购商品，尤其不适用无理由取消。",
        ],
      }],
    },
    {
      id: "art-5", index: "05", title: "支付与风控",
      blocks: [{
        type: "ol",
        items: [
          "支付方式：信用卡等由 Stripe 提供的方式（Visa / Mastercard / JCB 等，以结账页可选为准）。",
          "支付信息由 Stripe 处理；本站不存储完整卡号或信用卡安全码。",
          "支付失败、发卡行拒付、风控拦截导致无法完成的，视为订单未成立。",
          "请使用本人合法支付方式。盗刷、恶意拒付、虚假售后、异常高频下单或支付风险命中，可能导致订单取消、账号限制或进一步核验。",
        ],
      }],
    },
    {
      id: "art-6", index: "06", title: "发货、配送与签收",
      blocks: [
        {
          type: "ol",
          items: [
            "商品统一进口至日本履约点后，由日本国内承运商进行配送。国际干线运输、进口清关及入库成本已计入商品价格；日本国内运费按收货都道府县在结账页面另行计算。",
            "**预售及其他标注「预计发货 / 到货时间」的时间仅为参考时间**，可能因厂商出荷、质检返工、库存调配、清关、承运、目的地等因素产生偏差；实际发货时间以本站实际发货为准。",
            "日本国内运费以结账页按收货都道府县计算的金额为准。地址错误、拒收、逾期取件造成的退回或重寄费用由买家承担。",
            "因海关查验、地址错误、长期无人签收、无正当理由拒签、逾期取件、海关资料不完整等导致的延误、退回、毁损灭失风险及费用，在可归责于买方事由的范围内由买家承担。",
            "签收时请核对外包装。建议从封闭外箱开始拍摄连续开箱视频或连续照片，并保留外箱、面单与内包装。物流显示妥投、代签或投递柜入库，并不当然意味着商品状态无瑕疵或排除您依法享有的救济；本站会结合承运商记录与现有证据进行调查。承运商责任范围以外的部分，按本协议与适用法律处理。",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          text: "日本履约地址 {{JP_ADDRESS}} 仅用于日本国内履约联络，不是销售主体所在地，也不是未经确认即可寄回的退货地址。任何退货须先联系 {{SUPPORT}}，并以客服书面指定地址为准。",
        },
      ],
    },
    {
      id: "art-7", index: "07", title: "预售延期退款",
      blocks: [{
        type: "ol",
        items: [
          "预售商品会在商品页标明「预售」并展示预计发货/到货时间。",
          "若自该商品首次展示的预计发货日起满 90 日仍未发货，且订单尚未发货，您可就该商品申请按实付金额退款。",
          "若预计时间仅标到「某月」，起算日取该月最后一日。",
          "已发货、已签收或因您原因导致无法发货的，不适用本条。",
        ],
      }],
    },
    {
      id: "art-8", index: "08", title: "特殊品类：不适用笼统「七天无理由」",
      blocks: [
        {
          type: "p",
          text: "因商品性质特殊，以下品类**不适用笼统的七天无理由退货**；个人原因退换请自行处理。商品页将作出提示；**您选择购买，即视为同意相关规则并愿意承担相应费用与后果。**",
        },
        {
          type: "ul",
          items: [
            "未开封原盒、补充包、礼盒、双盒装、整箱等 sealed 商品",
            "预售商品（含定金/全款预售）",
            "一经售出难以按新品二次销售的特殊商品（商品页另行标注）",
            "明示随机、福袋、盲盒、组合包或「开封结果随机」的商品",
            "商品页另行标注「不支持无理由退换」的商品",
          ],
        },
        {
          type: "p",
          text: "不支持的个人原因包括但不限于：不喜欢、买多了、想换款、尺寸/款式预期不符、二级市场价格波动、开封后抽卡结果不理想等。本条不排除适用法律强制保留的消费者权利。",
        },
      ],
    },
    {
      id: "art-9", index: "09", title: "售后范围、举证与处理",
      blocks: [{
        type: "ol",
        items: [
          "**可受理范围**：运输导致的明显外包装破损致商品实质受损、错发、漏发、明显初期不良；须能合理证明问题在签收时即已存在。",
          "**非售后范围（示例）**：个人原因；已拆封/已开封；外箱轻微压痕、角损、工厂原有轻微瑕疵且不影响 sealed 完整性；您自行二次包装、转运、仓储不当造成的损坏；开封后的卡牌内容与期望不符。",
          "请于物流签收后 7 日内联系客服（{{SUPPORT}}）提出申请。逾期、证据不足或已自行丢弃包装的，可能影响调查与处理；但适用法律强制规定的权利不因此被排除。",
          "**举证**：请提供订单号、物流单号、外箱/面单/商品清晰照片，以及连续开箱视频或连续照片（建议从封闭包裹拍到取出商品）。本站将依据现有证据调查；证据越完整越有利于核实，但不会仅因缺少某一种形式材料即一律拒绝法定救济。",
          "**处理方式**：经核实属本站责任的，本站可优先安排补发或换货；无合理库存时可退还该商品实付金额。本站不接受到付退货。",
          "退货商品在本站签收前的风险由您承担；您应在收到可寄回通知后 7 日内寄出并提供单号。退货地址以客服书面指示为准，不得自行寄往日本履约地址。",
        ],
      }],
    },
    {
      id: "art-10", index: "10", title: "随机性、开封结果与品相",
      blocks: [{
        type: "ol",
        items: [
          "集换式卡牌开封结果具有随机性，可能出现重复或不含您期望的特定卡牌。",
          "本站不保证特定卡牌、卡号、签名、隐藏款、评级分数、保底结果或二级市场价格，亦不对开封结果承担退款或赔偿义务。",
          "同一批次商品可能存在封膜轻微褶皱、外盒压痕、角部磨损、印刷差异、厂商封装误差等情况。未影响商品主要功能和收藏识别的轻微外观差异，通常不视为质量问题。",
          "不得以卡位、卡序、称重、摇盒、封膜纹理、网络传闻或二级市场价格为依据主张退换、差价补偿或额外赔偿。",
        ],
      }],
    },
    {
      id: "art-11", index: "11", title: "买取服务暂停",
      blocks: [{ type: "p", text: "本站目前不提供卡牌买取服务，不接受买取申请或商品寄送，也不收集买取用途的身份证明、银行账户等资料。恢复时间以网站后续公告为准。" }],
    },
    {
      id: "art-12", index: "12", title: "禁止行为",
      blocks: [
        { type: "p", text: "您不得从事以下行为，否则本站有权采取限制账号、取消订单、追究责任等措施：" },
        {
          type: "ul",
          items: [
            "提供虚假信息、盗用他人身份或支付方式",
            "攻击、扫描、爬取、压测、逆向、绕过限速、干扰支付流程、批量注册、批量占库存、篡改请求、上传恶意内容或利用本站漏洞获利",
            "恶意拒付、虚假售后主张、重复纠缠同一已结案事由",
            "冒用他人身份、盗刷、洗钱、诽谤本站或其他用户、侵犯知识产权、违反适用法律法规",
          ],
        },
      ],
    },
    {
      id: "art-13", index: "13", title: "免责与责任范围",
      blocks: [{
        type: "ol",
        items: [
          "因不可抗力、承运商、海关、支付机构、发行商延期、供应商违约等原因造成的延误、丢失或损坏，本站在已履行合理包装与发货义务的前提下，责任以承运商理赔范围、本协议约定及适用法律强制规定为限。",
          "在法律允许的最大范围内，本站就本协议项下的赔偿责任以您就争议订单实际支付的商品价款为上限（不含运费、关税等第三方费用，法律另有强制规定的除外）。",
          "本站不对用户因投资、转卖、收藏预期、行情判断、抽卡结果、平台外交易或第三方服务故障造成的间接损失、机会损失、利润损失、商誉损失承担责任。",
        ],
      }],
    },
    {
      id: "art-14", index: "14", title: "协议变更",
      blocks: [{ type: "p", text: "本站有权更新本协议。更新后公布于网站即生效；您于生效后继续下单或使用服务，视为接受更新后的条款。重大变更将尽量通过网站提示告知。" }],
    },
    {
      id: "art-15", index: "15", title: "适用法律、管辖与联系方式",
      blocks: [
        {
          type: "p",
          text: "本协议原则上适用中华人民共和国法律，但不排除消费者所在地依法不得排除的强制性保护规定。因本协议引起的争议，双方应先协商；协商不成的，在法律允许范围内提交经营者所在地有管辖权的人民法院处理，强制性消费者保护规则另有规定的除外。",
        },
        {
          type: "infoCard",
          rows: [
            { label: "销售业者", value: "{{SELLER}}" },
            { label: "运营负责人", value: "{{REP}}" },
            { label: "中国地区负责人", value: "{{CHINA_REP}}" },
            { label: "经营者所在地", value: "{{ADDRESS}}" },
            { label: "日本国内履约地址", value: "{{JP_ADDRESS}}（非销售主体所在地；退货前须通过 {{SUPPORT}} 联系，地址以客服书面指示为准）" },
            { label: "电话", value: "{{PHONE}}（请优先邮件）" },
            { label: "客服", value: "{{SUPPORT}}" },
            { label: "批发合作", value: "{{B2B}}" },
          ],
        },
      ],
    },
  ],
};

const ja: LegalDocContent = {
  metaTitle: "利用規約 | PIMART CARD",
  title: "利用規約",
  subtitle: "用户协议 / Terms of Use",
  updatedAt: UPDATED.ja,
  sellerChip: "運営主体：{{SELLER}}",
  noticesHeading: "購入前の重要事項",
  notices: [
    { title: "注文をもって規約に同意", body: "閲覧、カート追加、注文・決済完了をもって、本規約・商品ページ案内・当時有効なルールに同意したものとみなします。" },
    { title: "特殊商品は一律クーリングオフ対象外", body: "未開封BOX・パック・予約・ランダム/開封系など、お客様都合の返品・交換は原則お受けできません。" },
  ],
  toc: toc("ja"),
  articles: [
    { id: "art-1", index: "01", title: "総則と購入前同意", blocks: [{ type: "ol", items: ["本規約は、{{SELLER}}（以下「当店」）とお客様との間の、PIMART CARD の利用・購入に関する契約です。運営責任者：{{REP}}。", "商品ごとのアフターサポート条件は商品ページ・本規約・特定商取引法に基づく表記・FAQ に従います。矛盾がある場合は商品ページの特記が優先されます。", "注文・決済完了をもって本規約に同意したものとみなします。同意できない場合はご注文くださいません。", "当店は各権利者の公式ショップではありません。商標は権利者に帰属します。"] }] },
    { id: "art-2", index: "02", title: "アカウント", blocks: [{ type: "ol", items: ["登録・決済・配送情報は正確に入力し、最新の状態に保ってください。", "アカウント情報は自己管理とし、当該アカウントでの行為は原則お客様の行為とみなします。", "住所不備等により履行不能となった場合、注文取消・発送保留ができ、損害はお客様負担となります。", "未成年者は保護者の同意のもとでご利用ください。", "複数アカウント、虚偽情報、bot、在庫占有、不正チャージバック等は禁止します。", "不正・濫用が疑われる場合、アカウント制限・注文取消・追加確認を求めることがあります。"] }] },
    { id: "art-3", index: "03", title: "商品と価格", blocks: [{ type: "ol", items: ["表示は商品ページ・決済画面に従います。画像はイメージです。", "価格は日本円（JPY）。最終金額は Stripe 決済画面の表示に従います。", "翻訳・発売日・相場情報は識別補助であり、投資助言ではありません。", "当店は特定の収集目的・転売利益・投資成果を保証しません。", "相場変動はキャンセル・差額補償の理由になりません。", "誤表示・欠品・不可抗力等で履行不能の場合、注文を取消し支払済み代金を返金できます。"] }] },
    { id: "art-4", index: "04", title: "注文と取消", blocks: [{ type: "ol", items: ["決済完了後、別段の定めがない限り契約が成立します。", "欠品時は通知のうえ取消返金または代替案を提示することがあります。", "当店の書面同意または特別条項がない限り、お客様都合の一方的取消はできません。", "明示の返金事由を除き、原則返金不可です。", "予約・ランダム・未開封BOX等は特にクーリングオフ的な取消対象外です。"] }] },
    { id: "art-5", index: "05", title: "決済とリスク管理", blocks: [{ type: "ol", items: ["支払方法は Stripe が提供するカード等（画面表示に従う）。", "カード番号等の機微情報は Stripe が処理し、当店は完全な番号を保存しません。", "決済失敗・不正検知により完了しない場合、注文は未成立です。", "不正利用・虚偽申告等が疑われる場合、取消・制限・追加確認の対象となります。"] }] },
    {
      id: "art-6", index: "06", title: "発送と受取",
      blocks: [
        { type: "ol", items: ["商品は日本の履行拠点へ一括輸入後、国内配送業者より発送します。国際幹線・通関・入庫費用は商品価格に含み、国内送料は都道府県別に決済時計算します。", "予約等の発送予定は目安であり、実際の発送日をもって確定します。", "住所不備・受取拒否・保管期限超過等による返送・再送費用はお客様負担です。", "受取時に外装を確認し、連続した開封動画または連続写真の保管を推奨します。追跡上の配達完了表示のみをもって、瑕疵がないことや救済が排除されるものではありません。当店は配送記録と提出証拠に基づき調査します。",] },
        { type: "callout", tone: "warn", text: "日本履行住所 {{JP_ADDRESS}} は販売業者所在地ではなく、事前確認なしの返品先でもありません。返品前に {{SUPPORT}} へ連絡し、書面指定の住所をご利用ください。" },
      ],
    },
    { id: "art-7", index: "07", title: "予約遅延の返金", blocks: [{ type: "ol", items: ["予約商品はページに予約表示と発送/入荷目安を記載します。", "初回表示の発送予定日から90日経過しても未発送の場合、当該商品の実支払額で返金申請できます。", "予定が「月」のみの場合は当該月末起算です。", "発送済・受取済またはお客様事由による未発送は対象外です。"] }] },
    {
      id: "art-8", index: "08", title: "特殊商品",
      blocks: [
        { type: "p", text: "次の商品は性質上、一律のクーリングオフ対象外です。購入をもって関連ルールに同意したものとみなします。" },
        { type: "ul", items: ["未開封BOX・パック・ギフト等の sealed 商品", "予約商品", "ランダム・福袋・開封結果ランダム商品", "ページで無理由返品不可と明示した商品"] },
        { type: "p", text: "好み変更・買過ぎ・相場変動・開封結果への不満等は返品理由になりません。法令により排除できない消費者権利は除きます。" },
      ],
    },
    {
      id: "art-9", index: "09", title: "アフターサポートと証憑",
      blocks: [{ type: "ol", items: ["対応可能例：輸送による実質的損害、誤配送、欠品、明らかな初期不良（受取時点で生じていたことが合理的に示せる場合）。", "非対応例：お客様都合、開封後の内容不満、sealed に影響しない軽微な外箱痕、二次梱包・保管不良による損傷。", "受取後7日以内に {{SUPPORT}} へご連絡ください。証憑不足や期限超過は調査・対応に影響し得ますが、法令上排除できない権利は失われません。", "注文番号、追跡番号、外箱/伝票/商品写真、連続開封動画または連続写真をご提出ください。特定形式の欠如のみを理由に一律拒否することはありません。", "当店責任と確認できた場合、補送・交換を優先し、在庫がない場合は実支払額を返金します。着払い返品不可。", "返送は客服書面指示の住所のみ。日本履行住所への無断返送は不可です。"] }],
    },
    { id: "art-10", index: "10", title: "ランダム性と状態", blocks: [{ type: "ol", items: ["パック等の封入結果はランダムです。", "特定カード・相場・鑑定スコア等は保証しません。", "軽微な箱潰れ・シュリンクのしわ等は、主要機能に影響しない限り原則品質問題としません。", "重量・シェイク・噂等に基づく返品・差額請求はお受けしません。"] }] },
    { id: "art-11", index: "11", title: "買取停止", blocks: [{ type: "p", text: "現在、買取サービスは停止しています。再開はサイト告知に従います。" }] },
    { id: "art-12", index: "12", title: "禁止行為", blocks: [{ type: "ul", items: ["虚偽情報・他人名義の利用", "攻撃、bot、在庫占有、決済妨害、脆弱性悪用", "虚偽アフターサポート・悪質チャージバック", "不正決済、知的財産侵害、法令違反"] }] },
    { id: "art-13", index: "13", title: "免責", blocks: [{ type: "ol", items: ["不可抗力・配送業者・通関・決済事業者・メーカー等に起因する遅延・損害は、合理的な梱包・発送義務を果たした範囲で、配送業者補償・本規約・強行法規の範囲に限ります。", "法令で認められる最大限度において、損害賠償は当該注文の商品実支払額を上限とします（強行法規を除く）。", "転売利益・機会損失等の間接損害は負いません。"] }] },
    { id: "art-14", index: "14", title: "規約変更", blocks: [{ type: "p", text: "当店は本規約を更新できます。掲載後に効力を生じ、以降の注文・利用は更新後規約への同意とみなします。" }] },
    {
      id: "art-15", index: "15", title: "管轄と連絡",
      blocks: [
        { type: "p", text: "本規約は原則として中華人民共和国法に準拠します。ただし、消費者の居住地で排除できない強行的保護規定を妨げません。紛争はまず協議し、協議不調の場合は法令の許す範囲で事業者所在地の管轄裁判所とします（消費者保護の強行規定がある場合を除く）。" },
        { type: "infoCard", rows: [
          { label: "販売業者", value: "{{SELLER}}" },
          { label: "運営責任者", value: "{{REP}}" },
          { label: "中国地域責任者", value: "{{CHINA_REP}}" },
          { label: "事業者所在地", value: "{{ADDRESS}}" },
          { label: "日本国内履行住所", value: "{{JP_ADDRESS}}（返品は {{SUPPORT}} に事前連絡）" },
          { label: "電話", value: "{{PHONE}}（メール優先）" },
          { label: "サポート", value: "{{SUPPORT}}" },
          { label: "卸売", value: "{{B2B}}" },
        ] },
      ],
    },
  ],
};

const en: LegalDocContent = {
  metaTitle: "Terms of Use | PIMART CARD",
  title: "Terms of Use",
  subtitle: "用户协议 / 利用規約",
  updatedAt: UPDATED.en,
  sellerChip: "Operator: {{SELLER}}",
  noticesHeading: "Key notices before purchase",
  notices: [
    { title: "Ordering means acceptance", body: "Browsing, adding to cart, placing an order and paying means you have read and accepted these Terms, product-page notes, and rules then in force." },
    { title: "No blanket cooling-off for special goods", body: "Sealed boxes/packs, pre-orders, and random/openable goods are generally not returnable for personal reasons." },
  ],
  toc: toc("en"),
  articles: [
    { id: "art-1", index: "01", title: "General & Consent", blocks: [{ type: "ol", items: ["These Terms are a binding agreement between you and {{SELLER}} (“we/the Site”) for using PIMART CARD. Person responsible: {{REP}}.", "After-sales rules vary by product and appear on product pages, these Terms, the Specified Commercial Transactions notice, and FAQ. Product-page specials prevail if inconsistent.", "By ordering and paying you accept these Terms. If you disagree, do not order.", "We are not an official store of IP rights holders; trademarks belong to their owners."] }] },
    { id: "art-2", index: "02", title: "Accounts", blocks: [{ type: "ol", items: ["Provide accurate registration, payment and shipping details and keep them updated.", "Safeguard credentials; actions via your account are generally treated as yours.", "If bad address or non-cooperation blocks fulfillment, we may cancel or hold shipment; related loss is yours.", "Minors need guardian consent.", "No multi-accounting, bots, stock hoarding, abusive chargebacks or exploiting bugs.", "We may restrict accounts, cancel orders or request verification where fraud/abuse is reasonably suspected."] }] },
    { id: "art-3", index: "03", title: "Products & Pricing", blocks: [{ type: "ol", items: ["Details follow product and checkout pages; images are illustrative.", "Prices are in JPY; final amount follows Stripe checkout.", "Translations, release dates and market refs help identification only and are not investment advice.", "We do **not** warrant fitness for a particular collecting, investment or resale purpose.", "Market swings are not grounds for cancel/refund/compensation.", "We may cancel and refund if fulfillment is impossible due to error, shortage, anomalous pricing or force majeure."] }] },
    { id: "art-4", index: "04", title: "Orders & Cancellation", blocks: [{ type: "ol", items: ["After payment, the contract is formed unless otherwise stated.", "On shortage we may notify and cancel with refund or propose alternatives.", "No unilateral cancel by you except with our written consent or special clauses.", "Refunds are generally unavailable except as expressly listed.", "Pre-orders, random and sealed goods especially exclude cooling-off style cancels."] }] },
    { id: "art-5", index: "05", title: "Payment & Risk", blocks: [{ type: "ol", items: ["Payment methods are those Stripe offers (cards etc. as shown at checkout).", "Sensitive card data is handled by Stripe; we do not store full PAN/CVV.", "Failed or blocked payment means no formed order.", "Fraud, abusive chargebacks or false claims may lead to cancel/restriction/verification."] }] },
    {
      id: "art-6", index: "06", title: "Shipping & Receipt",
      blocks: [
        { type: "ol", items: ["Goods are imported to our Japan fulfillment point then shipped by a domestic carrier. International freight/clearance/inbound costs are included in product price; domestic shipping is calculated by prefecture at checkout.", "Shown dispatch dates for pre-orders are estimates; actual dispatch date controls.", "Return/reship fees from bad address, refusal or missed pickup are borne by the buyer.", "Please inspect outer packaging on receipt. Continuous unboxing video or continuous photos are recommended. Tracking “delivered” alone does not prove condition or waive remedies; we investigate using carrier records and available evidence.",] },
        { type: "callout", tone: "warn", text: "Japan fulfillment address {{JP_ADDRESS}} is not the seller’s registered address and not an unsupervised return address. Contact {{SUPPORT}} first; use only the return address given in writing." },
      ],
    },
    { id: "art-7", index: "07", title: "Pre-order Delay Refund", blocks: [{ type: "ol", items: ["Pre-orders are labeled with an estimated dispatch/arrival window.", "If not shipped within 90 days from the first displayed estimate and still unshipped, you may request a refund of amounts paid for that item.", "Month-only estimates start from the last day of that month.", "Already shipped/received items or delays caused by you are excluded."] }] },
    {
      id: "art-8", index: "08", title: "Special Goods",
      blocks: [
        { type: "p", text: "Due to their nature, the following are **not** subject to a blanket cooling-off return. Purchase means acceptance of these rules." },
        { type: "ul", items: ["Sealed boxes/packs/gifts", "Pre-orders", "Random/lucky-bag/openable goods", "Items marked non-returnable without reason"] },
        { type: "p", text: "Change of mind, overbuying, market moves or pull results are not return reasons. Mandatory consumer rights that cannot be waived by law remain." },
      ],
    },
    {
      id: "art-9", index: "09", title: "After-sales & Evidence",
      blocks: [{ type: "ol", items: ["**In scope**: transit damage to the product, wrong item, shortage, clear initial defect reasonably shown at receipt.", "**Out of scope examples**: personal reasons; opened goods; minor box wear not affecting sealed integrity; damage from your repacking/storage; pull disappointment.", "Contact {{SUPPORT}} within 7 days of receipt. Late claims or weak evidence may limit investigation, but do not waive non-excludable statutory rights.", "**Evidence**: order/tracking numbers, clear photos of box/label/item, and continuous unboxing video **or** continuous photos. Stronger evidence helps verification; missing one format alone is not an automatic denial of statutory remedies.", "If our responsibility is confirmed we may resend/replace or refund the item amount paid. No COD returns.", "Return only to the address we specify in writing—not the Japan fulfillment address on your own."] }],
    },
    { id: "art-10", index: "10", title: "Randomness & Condition", blocks: [{ type: "ol", items: ["Pulls are random.", "No guarantee of specific cards, grades or market value.", "Minor sealed-box wear generally is not a quality defect if core function/ID is intact.", "Weight/shake/rumor claims are not accepted for returns or price adjustments."] }] },
    { id: "art-11", index: "11", title: "Buyback Paused", blocks: [{ type: "p", text: "Card buyback is currently paused. We do not accept applications or related ID/bank data. Resume will be announced on the site." }] },
    { id: "art-12", index: "12", title: "Prohibited Conduct", blocks: [{ type: "ul", items: ["False info or stolen payment methods", "Attacks, bots, stock hoarding, payment interference, exploit abuse", "False after-sales claims / abusive chargebacks", "IP infringement or other illegal conduct"] }] },
    { id: "art-13", index: "13", title: "Liability Limits", blocks: [{ type: "ol", items: ["For delays/loss/damage from force majeure, carriers, customs, processors, publishers or suppliers, our liability after reasonable packing/dispatch is limited to carrier recovery, these Terms and mandatory law.", "To the maximum extent permitted by law, damages are capped at amounts you paid for the disputed goods (excluding third-party fees), except where mandatory law requires otherwise.", "No liability for indirect loss, lost profits, resale expectations or third-party service failures."] }] },
    { id: "art-14", index: "14", title: "Changes", blocks: [{ type: "p", text: "We may update these Terms by posting on the site. Continued ordering/use after the effective date means acceptance. Material changes will be highlighted where practicable." }] },
    {
      id: "art-15", index: "15", title: "Governing Law & Contact",
      blocks: [
        { type: "p", text: "These Terms are principally governed by the laws of the People’s Republic of China, without excluding mandatory consumer protections of your place of residence that cannot be waived. Disputes should first be negotiated; failing that, submitted to a competent court at the seller’s domicile to the extent permitted by law, unless mandatory consumer rules provide otherwise." },
        { type: "infoCard", rows: [
          { label: "Seller", value: "{{SELLER}}" },
          { label: "Person responsible", value: "{{REP}}" },
          { label: "China regional contact", value: "{{CHINA_REP}}" },
          { label: "Seller address", value: "{{ADDRESS}}" },
          { label: "Japan fulfillment address", value: "{{JP_ADDRESS}} (contact {{SUPPORT}} before any return)" },
          { label: "Phone", value: "{{PHONE}} (email preferred)" },
          { label: "Support", value: "{{SUPPORT}}" },
          { label: "Wholesale", value: "{{B2B}}" },
        ] },
      ],
    },
  ],
};

export const TERMS_DOC: Record<Lang, LegalDocContent> = { zh, ja, en };
