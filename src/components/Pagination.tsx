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
    <nav className="mt-10 flex items-center justify-center gap-2 text-sm">
      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(searchParams, p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
            p === currentPage
              ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          {p}
        </a>
      ))}
    </nav>
  );
}
