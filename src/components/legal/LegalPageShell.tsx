import Link from "next/link";
import type { ReactNode } from "react";
import { COMPANY_SELLER, SUPPORT_EMAIL } from "@/lib/site";
import { LegalToc } from "@/components/legal/LegalToc";

export type LegalDocId = "terms" | "privacy" | "tokusho";

type TocItem = {
  id: string;
  label: string;
};

type LegalPageShellProps = {
  active: LegalDocId;
  title: string;
  subtitle: string;
  updatedAt: string;
  sellerLabel?: string;
  toc: TocItem[];
  notices?: ReactNode;
  children: ReactNode;
};

const DOC_LINKS: { id: LegalDocId; href: string; label: string }[] = [
  { id: "terms", href: "/terms", label: "用户协议" },
  { id: "privacy", href: "/privacy", label: "隐私政策" },
  { id: "tokusho", href: "/tokusho", label: "特定商取引法" },
];

export function LegalPageShell({
  active,
  title,
  subtitle,
  updatedAt,
  sellerLabel = `运营主体：${COMPANY_SELLER}`,
  toc,
  notices,
  children,
}: LegalPageShellProps) {
  return (
    <div className="legal-shell">
      <header className="legal-hero">
        <p className="legal-eyebrow">Legal · 法律信息</p>
        <h1 className="legal-title">{title}</h1>
        <p className="legal-subtitle">{subtitle}</p>
        <div className="legal-meta-row">
          <span className="legal-chip">最后更新：{updatedAt}</span>
          <span className="legal-chip">{sellerLabel}</span>
        </div>
        <nav className="legal-nav-pills" aria-label="法律文档切换">
          {DOC_LINKS.map((doc) => (
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
      </header>

      {notices}

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <LegalToc items={toc} />
        </aside>
        <div className="legal-main">{children}</div>
      </div>

      <footer className="legal-crosslinks">
        <p className="legal-crosslinks-heading">相关入口</p>
        <div className="legal-crosslinks-row">
          <Link href="/contact" className="legal-crosslink">
            联系客服
          </Link>
          <Link href="/after-sales" className="legal-crosslink">
            售后申请
          </Link>
          <Link href="/wholesale" className="legal-crosslink">
            批发合作
          </Link>
          <Link href="/wholesale-terms" className="legal-crosslink">
            批发条款
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
