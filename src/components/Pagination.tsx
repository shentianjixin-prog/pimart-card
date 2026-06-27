type Props = {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function buildHref(params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") usp.set(key, value);
  }
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `/?${qs}` : "/";
}

export function Pagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-1 text-sm">
      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(searchParams, p)}
          className={`flex h-9 w-9 items-center justify-center rounded-sm border text-xs transition ${
            p === currentPage
              ? "border-[var(--gold)] bg-[var(--gold)] text-black"
              : "border-transparent text-neutral-500 hover:border-[var(--border-subtle)] hover:text-[var(--ivory)]"
          }`}
        >
          {p}
        </a>
      ))}
    </nav>
  );
}
