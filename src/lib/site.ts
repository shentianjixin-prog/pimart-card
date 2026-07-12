/** 站点对外链接（可通过环境变量覆盖） */
export const LINE_CONTACT_URL =
  process.env.NEXT_PUBLIC_LINE_URL?.trim() || "https://line.me/R/ti/p/@pimartcard";

/** 客服邮箱：订单、物流、售后、会员账号 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@pimartcard.com";

/** B2B / 批发合作邮箱 */
export const B2B_EMAIL =
  process.env.NEXT_PUBLIC_B2B_EMAIL?.trim() || "info@pimartcard.com";
