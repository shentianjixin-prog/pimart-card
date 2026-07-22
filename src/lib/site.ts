/** 站点对外链接（可通过环境变量覆盖） */
export const LINE_CONTACT_URL =
  process.env.NEXT_PUBLIC_LINE_URL?.trim() || "https://line.me/R/ti/p/@pimartcard";

/** 客服邮箱：订单、物流、售后、会员账号 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@pimartcard.com";

/** B2B / 批发合作邮箱 */
export const B2B_EMAIL =
  process.env.NEXT_PUBLIC_B2B_EMAIL?.trim() || "info@pimartcard.com";

/** 主体信息（关于页 / 特商法） */
export const COMPANY_FOUNDED_YEAR = 2022;
/** 网站及业务负责人 */
export const COMPANY_REPRESENTATIVE = "KANDAKSIN";
/** 销售业者 / 商户名称 */
export const COMPANY_SELLER = "江苏派漫文化有限公司";
export const COMPANY_ADDRESS = "中国 江苏省南通市滨江新城15-601";
/** 中国地区负责人 */
export const CHINA_REGION_REPRESENTATIVE = "包海兵";
/** 对外联系电话（中国大陆） */
export const COMPANY_PHONE = "+86 131 4291 3561";
/** 日本国内配送联络地址；并非销售主体所在地或无条件退货地址 */
export const JAPAN_DELIVERY_CONTACT_ADDRESS =
  "〒170-0013 東京都豊島区東池袋1-33-4 ニュー池袋ハイツ705室";

/** 结账时实际可用方式由 Stripe、用户地区及设备共同决定 */
export const PAYMENT_METHODS = {
  zh: "信用卡/借记卡及 Stripe 结账页显示的其他支付方式（以结账页实际可用选项为准）",
  ja: "クレジットカード／デビットカードおよび Stripe のチェックアウト画面に表示されるその他の方法",
  en: "Credit/debit cards and other methods shown by Stripe at checkout",
} as const;
