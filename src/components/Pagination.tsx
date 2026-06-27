import { type FilterState, buildListingHref } from "@/lib/product-filters";

type Props = {
  currentPage: number;
  totalPages: number;
  filterState: FilterState;
};

export function Pagination({ currentPage, totalPages, filterState }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2 text-sm">
      {pages.map((p) => (
        <a
          key={p}
          href={buildListingHref(filterState, { page: p })}
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
