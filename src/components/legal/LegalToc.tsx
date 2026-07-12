type TocItem = {
  id: string;
  label: string;
};

type LegalTocProps = {
  items: TocItem[];
  heading?: string;
};

export function LegalToc({ items, heading = "目录" }: LegalTocProps) {
  return (
    <nav className="legal-toc" aria-label={heading}>
      <p className="legal-toc-heading">{heading}</p>
      <ol className="legal-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="legal-toc-link">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
