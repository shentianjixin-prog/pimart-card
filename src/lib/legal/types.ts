import type { Lang } from "@/lib/translations";

export type { Lang };

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }
  | { type: "callout"; tone?: "info" | "warn"; text: string }
  | { type: "infoCard"; rows: { label: string; value: string }[] };

export type LegalArticleContent = {
  id: string;
  index: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalNotice = {
  title: string;
  body: string;
  number?: string;
};

export type LegalDocContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  /** 含 {{SELLER}} 占位 */
  sellerChip: string;
  noticesHeading: string;
  notices: LegalNotice[];
  toc: { id: string; label: string }[];
  articles: LegalArticleContent[];
};

export type LegalShellUi = {
  eyebrow: string;
  updatedPrefix: string;
  tocHeading: string;
  relatedHeading: string;
  navTerms: string;
  navPrivacy: string;
  navTokusho: string;
  linkContact: string;
  linkAfterSales: string;
  linkWholesale: string;
  linkWholesaleTerms: string;
};

export type TokushoRow =
  | { id: string; label: string; value: string }
  | { id: string; label: string; blocks: { title: string; body: string }[] };

export type TokushoDocContent = {
  metaTitle: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sellerChip: string;
  noticesHeading: string;
  notices: LegalNotice[];
  rows: TokushoRow[];
};
