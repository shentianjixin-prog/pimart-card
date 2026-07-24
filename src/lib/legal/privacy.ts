import type { Lang, LegalDocContent } from "@/lib/legal/types";

const UPDATED = { zh: "2026年7月24日", ja: "2026年7月24日", en: "July 24, 2026" } as const;

function toc(lang: Lang) {
  const labels =
    lang === "zh"
      ? ["事业者信息", "收集的信息", "利用目的", "委托与第三方", "Cookie 与风控", "跨境处理", "安全管理", "保存期间", "披露与更正", "未成年人", "政策变更", "联系我们"]
      : lang === "ja"
        ? ["事業者情報", "取得する情報", "利用目的", "委託と第三者", "Cookieとリスク管理", "越境処理", "安全管理", "保存期間", "開示・訂正", "未成年者", "改定", "お問い合わせ"]
        : ["Operator Info", "Information Collected", "Purposes", "Processors & Third Parties", "Cookies & Risk", "Cross-border Processing", "Security", "Retention", "Access & Correction", "Minors", "Changes", "Contact"];
  return labels.map((label, i) => ({ id: `pv-${i + 1}`, label: `${String(i + 1).padStart(2, "0")} ${label}` }));
}

const zh: LegalDocContent = {
  metaTitle: "隐私政策 | PIMART CARD",
  title: "隐私政策",
  subtitle: "プライバシーポリシー / Privacy Policy",
  updatedAt: UPDATED.zh,
  sellerChip: "事业者：{{SELLER}}",
  noticesHeading: "隐私要点",
  notices: [
    { title: "不出售个人信息", body: "本站不会出售或出租您的个人信息；仅在履约、安全、法定义务必要范围内委托支付、物流等服务商。" },
    { title: "支付由 Stripe 处理", body: "卡号、安全码等支付敏感信息由 Stripe 处理，本站不存储完整卡号。" },
    { title: "风控日志用于安全保护", body: "为防止盗刷、恶意拒付、批量注册和接口滥用，本站会记录必要的访问与操作日志。" },
    { title: "咨询信息仅用于处理问题", body: "您通过邮件或联系页面提交的信息，将用于身份确认、回复、售后举证和安全管理。" },
    { title: "可依法请求更正或删除", body: "您可通过客服邮箱依法请求披露、更正、删除或利用停止；核实身份后处理。" },
  ],
  toc: toc("zh"),
  articles: [
    {
      id: "pv-1", index: "01", title: "事业者信息",
      blocks: [
        {
          type: "infoCard",
          rows: [
            { label: "销售业者", value: "{{SELLER}}" },
            { label: "运营负责人", value: "{{REP}}" },
            { label: "中国地区负责人", value: "{{CHINA_REP}}" },
            { label: "经营者所在地", value: "{{ADDRESS}}" },
            { label: "日本国内履约地址", value: "{{JP_ADDRESS}}（非销售主体所在地）" },
            { label: "电话", value: "{{PHONE}}（请优先邮件）" },
            { label: "咨询窗口", value: "{{SUPPORT}}" },
          ],
        },
        { type: "p", text: "本站依据经营者所在地及服务对象所在地适用的数据与个人信息保护法律，妥善管理您的个人信息。" },
      ],
    },
    {
      id: "pv-2", index: "02", title: "收集的信息",
      blocks: [
        { type: "p", text: "本站可能收集以下信息：" },
        {
          type: "ul",
          items: [
            "账号信息：昵称、邮箱、密码加密摘要、登录状态、会员设置",
            "身份与联络：姓名、电话、收货地址、会员账号信息",
            "交易信息：订单内容、金额、支付状态、物流单号、退款与售后沟通记录",
            "支付相关：支付金额、币种、支付结果、Stripe 返回的交易识别信息；本站不存储完整卡号或安全码",
            "技术与安全信息：Cookie、设备与浏览器信息、IP、访问日志、语言偏好、失败登录次数、请求频率、风控命中记录",
            "您主动提交的咨询内容、售后证据照片或视频等",
            "您在咨询、售后或代他人填写信息时提供的第三方姓名、地址、电话、邮箱等配送或联络信息",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "为完成配送、售后或客服处理，您可能需要提供收件人、代收人或其他相关人员的信息。提交该等信息前，请确认您已取得相关人员同意，并保证信息真实、准确、必要。",
        },
      ],
    },
    {
      id: "pv-3", index: "03", title: "利用目的",
      blocks: [
        {
          type: "ul",
          items: [
            "接受订单、确认身份、处理付款、退款与开票相关事务",
            "安排发货、物流跟踪、售后与退换核实",
            "处理您通过邮件、联系页面或其他客服渠道提交的咨询，并进行身份确认、回复通知、证据核验和问题归档",
            "账号注册、登录、密码重置、会员服务",
            "发送订单通知、物流通知、必要的服务邮件",
            "防范欺诈、盗刷、拒付滥用、批量请求、接口滥用、安全事件与漏洞利用",
            "改进网站功能、统计与服务品质（去标识化后可用于分析）",
            "履行法令义务及应对监管、司法、税务或警察机关请求",
          ],
        },
        { type: "callout", tone: "info", text: "未经您同意，本站不会将个人信息用于与上述目的无关的营销推销（法律允许的除外）。" },
      ],
    },
    {
      id: "pv-4", index: "04", title: "委托与第三方提供",
      blocks: [{
        type: "ol",
        items: [
          "为履行合同，本站可能在必要范围内将信息委托给：支付处理商（Stripe）、物流承运商、仓储/配送协力方、云主机、数据库、邮件发送、客服联络工具、错误监控和安全防护服务商。",
          "本站不会出售或出租您的个人信息，也不会将个人信息提供给与交易履行无关的第三方用于其独立营销。",
          "以下情形可提供：您同意时；法令要求时；法院、监管机关、警察、税务机关或法律程序要求时；保护人身财产安全所必需时；业务承继时在法令允许范围内。",
        ],
      }],
    },
    {
      id: "pv-5", index: "05", title: "Cookie、日志与风控技术",
      blocks: [{
        type: "ol",
        items: [
          "本站使用 Cookie 维持购物车、登录会话、语言偏好和基础安全校验。禁用 Cookie 可能导致无法登录、下单或保存购物车。",
          "为保护账号与交易安全，本站可能记录访问频率、请求来源、失败登录、异常表单提交和支付风险信号，并据此进行限速、拦截、复核或要求补充信息。",
          "本站不会使用 Cookie 获取与本站服务无关的敏感个人信息。",
        ],
      }],
    },
    {
      id: "pv-6", index: "06", title: "跨境处理与保存地点",
      blocks: [
        {
          type: "p",
          text: "本站由中国经营主体面向日本及其他国家和地区的用户提供服务。为完成下单、支付、履约、客服与安全防护，订单与个人信息可能在中国、日本以及 Stripe 等服务商所在的其他国家或地区被处理、存储或跨境传输。",
        },
        {
          type: "callout",
          tone: "warn",
          text: "您继续下单、注册或提交咨询，即表示您知悉并同意上述跨境处理安排。我们将在合理范围内选择具备安全管理措施的服务商，并仅在达成使用目的所需范围内传输信息。关于向境外第三方提供个人信息，本站将依照适用法律采取告知、取得同意、订立合同或其他持续保护措施（以适用规则要求者为准）。",
        },
      ],
    },
    {
      id: "pv-7", index: "07", title: "安全管理",
      blocks: [{ type: "p", text: "本站采用 HTTPS、密码哈希、访问控制、基础速率限制、安全响应头、第三方支付托管等合理的组织与技术措施，防止泄露、灭失、损毁和滥用。尽管如此，互联网传输与存储无法保证绝对安全，请您知悉并自行保护账号密码。" }],
    },
    {
      id: "pv-8", index: "08", title: "保存期间",
      blocks: [{
        type: "ul",
        items: [
          "订单、支付、配送、售后和会计相关记录通常至少保存 5 年，或依适用法律要求保存更长时间。",
          "账号信息在用户注销或长期不使用后可申请删除，但为履行法定义务、处理争议、防止滥用而必须保留的信息除外。",
          "客服咨询、售后证据和联系记录会在问题处理、质量改善、争议防止和法定义务所需期间内保存。",
          "安全日志会在达成风控、安全审计和故障排查目的所需期间内保存。",
        ],
      }],
    },
    {
      id: "pv-9", index: "09", title: "披露、更正、删除等请求",
      blocks: [{
        type: "p",
        text: "您可依法请求披露、更正、追加、删除、利用停止、停止向第三方提供等。请通过 {{SUPPORT}} 或联系页面提出。本站将在核实身份后，于合理期限内依法处理；法令允许拒绝的，将说明理由。若相关信息属于交易履行、税务、会计、风控、争议处理或法律规定必须保存的信息，本站可能无法立即删除，但会限制在必要目的内使用。",
      }],
    },
    {
      id: "pv-10", index: "10", title: "未成年人",
      blocks: [{ type: "p", text: "本站服务原则上不面向 13 岁以下儿童。未成年人使用本站进行购买、预售或提交个人信息前，应取得监护人同意。若发现误收集，将尽快删除或采取必要限制。" }],
    },
    {
      id: "pv-11", index: "11", title: "政策变更",
      blocks: [{ type: "p", text: "本站可因业务、法律或安全要求修订本政策并公布于网站。重大变更将尽量提示。继续使用服务视为知悉更新内容。" }],
    },
    {
      id: "pv-12", index: "12", title: "联系我们",
      blocks: [{ type: "p", text: "隐私相关咨询：{{SUPPORT}} ｜ 电话 {{PHONE}}（请优先邮件）" }],
    },
  ],
};

const ja: LegalDocContent = {
  metaTitle: "プライバシーポリシー | PIMART CARD",
  title: "プライバシーポリシー",
  subtitle: "隐私政策 / Privacy Policy",
  updatedAt: UPDATED.ja,
  sellerChip: "事業者：{{SELLER}}",
  noticesHeading: "ポイント",
  notices: [
    { title: "個人情報を販売しません", body: "販売・賃貸は行いません。履行・安全・法令上必要な範囲で決済・物流等へ委託します。" },
    { title: "決済は Stripe が処理", body: "カード番号等は Stripe が処理し、当店は完全な番号を保存しません。" },
    { title: "ログは安全保護のため", body: "不正利用防止のため、必要なアクセス・操作ログを記録します。" },
    { title: "お問い合わせ情報の利用", body: "メールやお問い合わせフォームの情報は本人確認・回答・アフターサポート・安全管理に用います。" },
    { title: "開示・訂正等の請求", body: "法令に基づき、サポートメールへ開示・訂正・削除等を請求できます。" },
  ],
  toc: toc("ja"),
  articles: [
    { id: "pv-1", index: "01", title: "事業者情報", blocks: [
      { type: "infoCard", rows: [
        { label: "販売業者", value: "{{SELLER}}" }, { label: "運営責任者", value: "{{REP}}" },
        { label: "中国地域責任者", value: "{{CHINA_REP}}" }, { label: "事業者所在地", value: "{{ADDRESS}}" },
        { label: "日本国内履行住所", value: "{{JP_ADDRESS}}（販売業者所在地ではありません）" },
        { label: "電話", value: "{{PHONE}}（メール優先）" }, { label: "窓口", value: "{{SUPPORT}}" },
      ]},
      { type: "p", text: "当店は適用される個人情報保護法令に従い情報を管理します。" },
    ]},
    { id: "pv-2", index: "02", title: "取得する情報", blocks: [
      { type: "ul", items: ["アカウント情報", "氏名・電話・配送先", "注文・決済・物流・アフターサポート記録", "Stripe の取引識別情報（完全なカード番号は保存しません）", "Cookie・IP・アクセスログ・言語設定・リスク信号", "お問い合わせ内容・証拠写真/動画", "第三者の配送連絡先（同意取得のうえ提出してください）"] },
    ]},
    { id: "pv-3", index: "03", title: "利用目的", blocks: [
      { type: "ul", items: ["注文・本人確認・決済・返金", "発送・追跡・アフターサポート", "メール等での問い合わせ対応", "会員サービス", "注文・配送通知", "不正防止・セキュリティ", "サービス改善（匿名化後の分析を含む）", "法令対応"] },
      { type: "callout", tone: "info", text: "同意なく、上記と無関係な勧誘目的には原則用いません（法令で許される場合を除く）。" },
    ]},
    { id: "pv-4", index: "04", title: "委託と第三者", blocks: [{ type: "ol", items: ["Stripe、配送業者、クラウド、メール送信、監視・セキュリティ事業者等へ必要範囲で委託します。", "個人情報を販売・賃貸せず、履行と無関係な第三者の独自マーケには提供しません。", "同意時、法令・公的機関要請時、生命身体財産保護、事業承継等の場合に提供し得ます。"] }] },
    { id: "pv-5", index: "05", title: "Cookieとリスク管理", blocks: [{ type: "ol", items: ["カート・ログイン・言語・基礎セキュリティに Cookie を使用します。", "不正対策のためアクセス頻度等を記録し、制限・再確認を行うことがあります。", "本サービスと無関係な機微情報取得には用いません。"] }] },
    { id: "pv-6", index: "06", title: "越境処理", blocks: [
      { type: "p", text: "中国の事業者が日本等の利用者へサービスを提供します。注文・決済・履行・サポートのため、情報は中国・日本・Stripe 等の所在国で処理・保存・越境移転されることがあります。" },
      { type: "callout", tone: "warn", text: "注文・登録・問い合わせの継続をもって、上記越境処理を認識し同意したものとみなします。適用法令に従い、告知・同意・契約その他の継続的保護措置を講じます。" },
    ]},
    { id: "pv-7", index: "07", title: "安全管理", blocks: [{ type: "p", text: "HTTPS、パスワードハッシュ、アクセス制御、レート制限、第三者決済等の合理的措置を講じます。インターネット上の絶対安全は保証できません。" }] },
    { id: "pv-8", index: "08", title: "保存期間", blocks: [{ type: "ul", items: ["取引・会計記録は原則5年以上（法令により延長）", "退会後も法令・紛争・濫用防止に必要な情報は保持し得ます", "お問い合わせ・証拠は対応に必要な期間保存", "セキュリティログは監査・障害対応に必要な期間保存"] }] },
    { id: "pv-9", index: "09", title: "開示・訂正", blocks: [{ type: "p", text: "開示・訂正・削除等は {{SUPPORT}} へ。本人確認後、法令に従い対応します。法令保存義務がある情報は即時削除できない場合があります。" }] },
    { id: "pv-10", index: "10", title: "未成年者", blocks: [{ type: "p", text: "原則13歳未満向けではありません。未成年者は保護者同意が必要です。" }] },
    { id: "pv-11", index: "11", title: "改定", blocks: [{ type: "p", text: "本ポリシーは改定・掲載により効力を生じます。継続利用は更新内容の認識とみなします。" }] },
    { id: "pv-12", index: "12", title: "お問い合わせ", blocks: [{ type: "p", text: "プライバシー関連：{{SUPPORT}} ｜ {{PHONE}}（メール優先）" }] },
  ],
};

const en: LegalDocContent = {
  metaTitle: "Privacy Policy | PIMART CARD",
  title: "Privacy Policy",
  subtitle: "隐私政策 / プライバシーポリシー",
  updatedAt: UPDATED.en,
  sellerChip: "Operator: {{SELLER}}",
  noticesHeading: "Privacy highlights",
  notices: [
    { title: "We do not sell personal data", body: "We do not sell or rent your personal data; we share it with processors (payment, logistics, etc.) only as needed for fulfillment, security and legal duties." },
    { title: "Payments handled by Stripe", body: "Card numbers and security codes are handled by Stripe; we do not store full card numbers." },
    { title: "Risk logs for security", body: "We log necessary access/operation data to fight fraud, abusive chargebacks, bulk abuse and API misuse." },
    { title: "Inquiry data for support only", body: "Information you submit by email or the contact form is used for identity checks, replies, after-sales evidence and security." },
    { title: "Access & deletion requests", body: "You may request disclosure, correction, deletion or use suspension via support email after identity verification." },
  ],
  toc: toc("en"),
  articles: [
    { id: "pv-1", index: "01", title: "Operator Info", blocks: [
      { type: "infoCard", rows: [
        { label: "Seller", value: "{{SELLER}}" }, { label: "Person responsible", value: "{{REP}}" },
        { label: "China regional contact", value: "{{CHINA_REP}}" }, { label: "Seller address", value: "{{ADDRESS}}" },
        { label: "Japan fulfillment address", value: "{{JP_ADDRESS}} (not the seller’s registered address)" },
        { label: "Phone", value: "{{PHONE}} (email preferred)" }, { label: "Contact", value: "{{SUPPORT}}" },
      ]},
      { type: "p", text: "We manage personal data under applicable privacy laws of the operator’s and users’ locations." },
    ]},
    { id: "pv-2", index: "02", title: "Information Collected", blocks: [
      { type: "ul", items: ["Account data", "Name, phone, shipping address", "Orders, payments, tracking, after-sales records", "Stripe transaction identifiers (no full PAN/CVV stored)", "Cookies, device/IP logs, language, risk signals", "Inquiry content and evidence media", "Third-party delivery contacts you submit with their consent"] },
    ]},
    { id: "pv-3", index: "03", title: "Purposes", blocks: [
      { type: "ul", items: ["Orders, identity, payment, refunds", "Shipping, tracking, after-sales", "Email/contact-form support", "Membership services", "Order/shipping notices", "Fraud and security", "Service improvement (including de-identified analytics)", "Legal compliance"] },
      { type: "callout", tone: "info", text: "We do not use personal data for unrelated marketing without consent, except where law allows." },
    ]},
    { id: "pv-4", index: "04", title: "Processors & Third Parties", blocks: [{ type: "ol", items: ["We may engage Stripe, carriers, cloud, email, monitoring and security vendors as needed.", "We do not sell/rent personal data or give it to unrelated parties for their own marketing.", "We may disclose with consent, by law, to authorities, for safety, or in permitted business succession."] }] },
    { id: "pv-5", index: "05", title: "Cookies & Risk", blocks: [{ type: "ol", items: ["Cookies support cart, login, language and basic security.", "We may rate-limit, block or request extra checks based on risk signals.", "Cookies are not used to obtain unrelated sensitive data."] }] },
    { id: "pv-6", index: "06", title: "Cross-border Processing", blocks: [
      { type: "p", text: "A China-based operator serves users in Japan and elsewhere. Order and personal data may be processed, stored or transferred in China, Japan and countries where Stripe/other processors operate." },
      { type: "callout", tone: "warn", text: "By continuing to order, register or submit inquiries, you acknowledge and agree to this cross-border processing. We take notice/consent/contractual or other ongoing safeguards as required by applicable law (including APPI overseas-transfer expectations where relevant)." },
    ]},
    { id: "pv-7", index: "07", title: "Security", blocks: [{ type: "p", text: "We use HTTPS, password hashing, access control, rate limits, security headers and hosted payments. Absolute internet security cannot be guaranteed." }] },
    { id: "pv-8", index: "08", title: "Retention", blocks: [{ type: "ul", items: ["Transaction/accounting records generally ≥5 years or longer if law requires", "Account data may be deleted after closure except where retention is legally required", "Support/evidence kept as needed for handling, quality and disputes", "Security logs kept as needed for audit and incident response"] }] },
    { id: "pv-9", index: "09", title: "Access & Correction", blocks: [{ type: "p", text: "Request disclosure/correction/deletion via {{SUPPORT}}. We act within a reasonable time after identity checks. Legally required records may not be deleted immediately but will be limited to necessary purposes." }] },
    { id: "pv-10", index: "10", title: "Minors", blocks: [{ type: "p", text: "Not directed to children under 13. Minors need guardian consent before purchasing or submitting personal data." }] },
    { id: "pv-11", index: "11", title: "Changes", blocks: [{ type: "p", text: "We may update this Policy by posting on the site. Continued use means awareness of the update." }] },
    { id: "pv-12", index: "12", title: "Contact", blocks: [{ type: "p", text: "Privacy inquiries: {{SUPPORT}} | {{PHONE}} (email preferred)" }] },
  ],
};

export const PRIVACY_DOC: Record<Lang, LegalDocContent> = { zh, ja, en };
