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
/** 代表 / 法人（个人） */
export const COMPANY_REPRESENTATIVE = "沈熙晨";
/** 销售业者 / 公司名 */
export const COMPANY_SELLER = "レモン商事";
export const COMPANY_ADDRESS = "東京都板橋区弥生町１－２－１０６";
/** 对外展示电话（空号占位，请优先邮件联系） */
export const COMPANY_PHONE = "03-6914-5820";
