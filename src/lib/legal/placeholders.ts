import {
  B2B_EMAIL,
  CHINA_REGION_REPRESENTATIVE,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_REPRESENTATIVE,
  COMPANY_SELLER,
  JAPAN_DELIVERY_CONTACT_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site";
import type { Lang, LegalShellUi } from "@/lib/legal/types";

const VARS: Record<string, string> = {
  SELLER: COMPANY_SELLER,
  REP: COMPANY_REPRESENTATIVE,
  CHINA_REP: CHINA_REGION_REPRESENTATIVE,
  ADDRESS: COMPANY_ADDRESS,
  JP_ADDRESS: JAPAN_DELIVERY_CONTACT_ADDRESS,
  PHONE: COMPANY_PHONE,
  SUPPORT: SUPPORT_EMAIL,
  B2B: B2B_EMAIL,
};

/** 将 {{KEY}} 替换为站点常量 */
export function fillPlaceholders(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => VARS[key] ?? "");
}

export function fillDeep<T>(value: T): T {
  if (typeof value === "string") return fillPlaceholders(value) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = fillDeep(v);
    return out as T;
  }
  return value;
}

export const LEGAL_SHELL_UI: Record<Lang, LegalShellUi> = {
  zh: {
    eyebrow: "Legal · 法律信息",
    updatedPrefix: "最后更新：",
    tocHeading: "目录",
    relatedHeading: "相关入口",
    navTerms: "用户协议",
    navPrivacy: "隐私政策",
    navTokusho: "特定商取引法",
    linkContact: "联系客服",
    linkAfterSales: "售后申请",
    linkWholesale: "批发合作",
    linkWholesaleTerms: "批发条款",
  },
  ja: {
    eyebrow: "Legal · 法的情報",
    updatedPrefix: "最終更新：",
    tocHeading: "目次",
    relatedHeading: "関連リンク",
    navTerms: "利用規約",
    navPrivacy: "プライバシーポリシー",
    navTokusho: "特定商取引法",
    linkContact: "お問い合わせ",
    linkAfterSales: "アフターサポート",
    linkWholesale: "卸売提携",
    linkWholesaleTerms: "卸売条件",
  },
  en: {
    eyebrow: "Legal · Legal Information",
    updatedPrefix: "Last updated: ",
    tocHeading: "Contents",
    relatedHeading: "Related",
    navTerms: "Terms of Use",
    navPrivacy: "Privacy Policy",
    navTokusho: "Legal Notice",
    linkContact: "Contact",
    linkAfterSales: "After-sales",
    linkWholesale: "Wholesale",
    linkWholesaleTerms: "Wholesale Terms",
  },
};
