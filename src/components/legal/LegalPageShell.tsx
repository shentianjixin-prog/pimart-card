import Link from "next/link";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";
import { LEGAL_SHELL_UI } from "@/lib/legal/placeholders";
import type { Lang, LegalShellUi } from "@/lib/legal/types";
import { LegalToc } from "@/components/legal/LegalToc";

export type LegalDocId = "terms" | "privacy" | "tokusho" | "wholesale";

type TocItem = { id: string; label: string };

type LegalPageShellProps = {
  active: LegalDocId;
  lang: Lang;
  title: string;
  subtitle: string;
  updatedAt: string;
  sellerLabel?: string;
  toc: TocItem[];
  notices?: ReactNode;
  children: ReactNode;
  /** 批发条款页可不显示顶部三法 pill 中的激活态 */
  hideDocPills?: boolean;
};

export function LegalPageShell({
  active,
  lang,
  title,
  subtitle,
  updatedAt,
  sellerLabel,
  toc,
  notices,
  children,
  hideDocPills = false,
}: LegalPageShellProps) {
  const ui: LegalShellUi = LEGAL_SHELL_UI[lang];
  const docLinks: { id: LegalDocId; href: string; label: string }[] = [
    { id: "terms", href: "/terms", label: ui.navTerms },
    { id: "privacy", href: "/privacy", label: ui.navPrivacy },
    { id: "tokusho", href: "/tokusho", label: ui.navTokusho },
  ];

  return (
    <div className="legal-shell">
      <header className="legal-hero">
        <p className="legal-eyebrow">{ui.eyebrow}</p>
        <h1 className="legal-title">{title}</h1>
        <p className="legal-subtitle">{subtitle}</p>
        <div className="legal-meta-row">
          <span className="legal-chip">
            {ui.updatedPrefix}
            {updatedAt}
          </span>
          {sellerLabel ? <span className="legal-chip">{sellerLabel}</span> : null}
        </div>
        {!hideDocPills ? (
          <nav className="legal-nav-pills" aria-label={ui.eyebrow}>
            {docLinks.map((doc) => (
              <Link
                key={doc.id}
                href={doc.href}
                className={`legal-nav-pill${active === doc.id ? " is-active" : ""}`}
                aria-current={active === doc.id ? "page" : undefined}
              >
                {doc.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      {notices}

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <LegalToc items={toc} heading={ui.tocHeading} />
        </aside>
        <div className="legal-main">{children}</div>
      </div>

      <footer className="legal-crosslinks">
        <p className="legal-crosslinks-heading">{ui.relatedHeading}</p>
        <div className="legal-crosslinks-row">
          <Link href="/contact" className="legal-crosslink">
            {ui.linkContact}
          </Link>
          <Link href="/after-sales" className="legal-crosslink">
            {ui.linkAfterSales}
          </Link>
          <Link href="/wholesale" className="legal-crosslink">
            {ui.linkWholesale}
          </Link>
          <Link href="/wholesale-terms" className="legal-crosslink">
            {ui.linkWholesaleTerms}
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="legal-crosslink">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  );
}

type LegalArticleProps = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

export function LegalArticle({ id, index, title, children }: LegalArticleProps) {
  return (
    <section id={id} className="legal-article scroll-mt-28">
      <header className="legal-article-head">
        <span className="legal-article-index" aria-hidden="true">
          {index}
        </span>
        <h2 className="legal-article-title">{title}</h2>
      </header>
      <div className="legal-article-body">{children}</div>
    </section>
  );
}
