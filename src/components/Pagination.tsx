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
    <nav className="mt-12 flex items-center justify-center gap-2 text-sm">
      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(searchParams, p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-medium transition ${
            p === currentPage
              ? "border-[#111827] bg-[#111827] text-white"
              : "border-[rgba(17,24,39,0.08)] bg-white text-[#6b7280] hover:border-[#111827]/20 hover:text-[#111827]"
          }`}
        >
          {p}
        </a>
      ))}
    </nav>
  );
}
