"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/lang-context";
import {
  type FilterFacets,
  type FilterState,
  type SortKey,
  type StockKey,
  GAMES,
  PRODUCT_TYPES,
  SORT_OPTIONS,
  STOCK_OPTIONS,
  buildListingHref,
  toggleInList,
} from "@/lib/product-filters";

type Props = {
  state: FilterState;
  facets: FilterFacets;
  total: number;
  children: React.ReactNode;
};

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button
        type="button"
        className="filter-section-head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

function CheckOption({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}) {
  return (
    <label className="filter-option">
      <input type="checkbox" checked={checked} onChange={onChange} className="filter-checkbox" />
      <span className="filter-option-label">
        {label}
        {typeof count === "number" && (
          <span className="filter-option-count">({count})</span>
        )}
      </span>
    </label>
  );
}

function FilterPanelContent({
  state,
  facets,
  onNavigate,
  onPriceApply,
}: {
  state: FilterState;
  facets: FilterFacets;
  onNavigate: (patch: Partial<FilterState>) => void;
  onPriceApply: (min?: string, max?: string) => void;
}) {
  const T = useT();
  const [minPrice, setMinPrice] = useState(state.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(state.maxPrice ?? "");

  useEffect(() => {
    setMinPrice(state.minPrice ?? "");
    setMaxPrice(state.maxPrice ?? "");
  }, [state.minPrice, state.maxPrice]);

  return (
    <div className="filter-panel-inner">
      <FilterSection title={T("filter_product_type")}>
        {PRODUCT_TYPES.map((key) => {
          const facet = facets.types.find((f) => f.key === key);
          return (
            <CheckOption
              key={key}
              checked={state.type.includes(key)}
              label={T(`filter_type_${key}`)}
              count={facet?.count}
              onChange={() =>
                onNavigate({ type: toggleInList(state.type, key), page: 1 })
              }
            />
          );
        })}
      </FilterSection>

      <FilterSection title={T("filter_game")}>
        {GAMES.map((key) => {
          const facet = facets.games.find((f) => f.key === key);
          return (
            <CheckOption
              key={key}
              checked={state.game.includes(key)}
              label={T(`filter_game_${key}`)}
              count={facet?.count}
              onChange={() =>
                onNavigate({ game: toggleInList(state.game, key), page: 1 })
              }
            />
          );
        })}
      </FilterSection>

      {facets.languages.length > 0 && (
        <FilterSection title={T("filter_language")}>
          {facets.languages.map(({ value, count }) => (
            <CheckOption
              key={value}
              checked={state.language.includes(value)}
              label={value}
              count={count}
              onChange={() =>
                onNavigate({
                  language: toggleInList(state.language, value),
                  page: 1,
                })
              }
            />
          ))}
        </FilterSection>
      )}

      {facets.series.length > 0 && (
        <FilterSection title={T("filter_series")}>
          {facets.series.slice(0, 12).map(({ value, count }) => (
            <CheckOption
              key={value}
              checked={state.series.includes(value)}
              label={value}
              count={count}
              onChange={() =>
                onNavigate({
                  series: toggleInList(state.series, value),
                  page: 1,
                })
              }
            />
          ))}
        </FilterSection>
      )}

      {facets.rarities.length > 0 && (
        <FilterSection title={T("filter_rarity")}>
          {facets.rarities.slice(0, 12).map(({ value, count }) => (
            <CheckOption
              key={value}
              checked={state.rarity.includes(value)}
              label={value}
              count={count}
              onChange={() =>
                onNavigate({
                  rarity: toggleInList(state.rarity, value),
                  page: 1,
                })
              }
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title={T("filter_price")}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={T("filter_price_min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field w-1/2"
          />
          <span className="text-[#9ca3af]">~</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={T("filter_price_max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field w-1/2"
          />
        </div>
        <button
          type="button"
          className="btn-secondary mt-3 w-full text-sm"
          onClick={() => onPriceApply(minPrice || undefined, maxPrice || undefined)}
        >
          {T("filter_apply_price")}
        </button>
      </FilterSection>

      <FilterSection title={T("filter_stock")}>
        {STOCK_OPTIONS.map((key) => (
          <CheckOption
            key={key}
            checked={state.stock.includes(key)}
            label={
              key === "instock"
                ? T("filter_instock")
                : key === "preorder"
                  ? T("filter_preorder")
                  : T("filter_stock_soldout")
            }
            onChange={() =>
              onNavigate({ stock: toggleInList(state.stock, key as StockKey), page: 1 })
            }
          />
        ))}
      </FilterSection>
    </div>
  );
}

function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="filter-sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="filter-sheet-backdrop" onClick={onClose} aria-label="Close" />
      <div className="filter-sheet-panel">
        <div className="filter-sheet-header">
          <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
          <button type="button" className="filter-sheet-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="filter-sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function ProductListingControls({ state, facets, total, children }: Props) {
  const T = useT();
  const router = useRouter();
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);

  const navigate = useCallback(
    (patch: Partial<FilterState>) => {
      router.push(buildListingHref(state, patch));
    },
    [router, state]
  );

  const handlePriceApply = (min?: string, max?: string) => {
    navigate({ minPrice: min, maxPrice: max, page: 1 });
    setSheet(null);
  };

  const handleSort = (sort: SortKey) => {
    navigate({ sort, page: 1 });
    setSheet(null);
  };

  const clearAll = () => {
    router.push(state.q ? `/?q=${encodeURIComponent(state.q)}` : "/?inStock=1");
  };

  const hasFilters =
    state.type.length > 0 ||
    state.game.length > 0 ||
    state.language.length > 0 ||
    state.series.length > 0 ||
    state.rarity.length > 0 ||
    state.stock.length > 0 ||
    !!state.minPrice ||
    !!state.maxPrice ||
    !!state.category ||
    !!state.boxType;

  return (
    <>
      <div className="filter-mobile-bar lg:hidden">
        <button type="button" className="filter-mobile-btn" onClick={() => setSheet("filter")}>
          {T("filter_filters")}
          {hasFilters && <span className="filter-mobile-badge" />}
        </button>
        <button type="button" className="filter-mobile-btn" onClick={() => setSheet("sort")}>
          {T("filter_sort")}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="filter-sidebar hidden lg:block">
          <div className="filter-sidebar-head">
            <h2 className="text-sm font-semibold text-[#111827]">{T("filter_filters")}</h2>
            {hasFilters && (
              <button type="button" className="filter-clear-link" onClick={clearAll}>
                {T("filter_clear_all")}
              </button>
            )}
          </div>
          <FilterPanelContent
            state={state}
            facets={facets}
            onNavigate={navigate}
            onPriceApply={handlePriceApply}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="filter-toolbar">
            <p className="filter-count">
              <span className="font-semibold text-[#111827]">{total}</span>
              {T("page_total_unit")}
            </p>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-sm text-[#6b7280]">{T("filter_sort")}</span>
              <select
                value={state.sort}
                onChange={(e) => handleSort(e.target.value as SortKey)}
                className="filter-sort-select"
                aria-label={T("filter_sort")}
              >
                {SORT_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {T(`filter_sort_${key}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="filter-chips">
              {state.type.map((v) => (
                <button
                  key={`t-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ type: state.type.filter((x) => x !== v), page: 1 })
                  }
                >
                  {T(`filter_type_${v}`)} ×
                </button>
              ))}
              {state.game.map((v) => (
                <button
                  key={`g-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ game: state.game.filter((x) => x !== v), page: 1 })
                  }
                >
                  {T(`filter_game_${v}`)} ×
                </button>
              ))}
              {state.language.map((v) => (
                <button
                  key={`l-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({
                      language: state.language.filter((x) => x !== v),
                      page: 1,
                    })
                  }
                >
                  {v} ×
                </button>
              ))}
              {state.series.map((v) => (
                <button
                  key={`s-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ series: state.series.filter((x) => x !== v), page: 1 })
                  }
                >
                  {v} ×
                </button>
              ))}
              {state.rarity.map((v) => (
                <button
                  key={`r-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ rarity: state.rarity.filter((x) => x !== v), page: 1 })
                  }
                >
                  {v} ×
                </button>
              ))}
              {state.stock.map((v) => (
                <button
                  key={`st-${v}`}
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ stock: state.stock.filter((x) => x !== v), page: 1 })
                  }
                >
                  {v === "instock"
                    ? T("filter_instock")
                    : v === "preorder"
                      ? T("filter_preorder")
                      : T("filter_stock_soldout")}{" "}
                  ×
                </button>
              ))}
              {(state.minPrice || state.maxPrice) && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    navigate({ minPrice: undefined, maxPrice: undefined, page: 1 })
                  }
                >
                  {state.minPrice && state.maxPrice
                    ? `¥${state.minPrice}–¥${state.maxPrice}`
                    : state.minPrice
                      ? `≥¥${state.minPrice}`
                      : `≤¥${state.maxPrice}`}{" "}
                  ×
                </button>
              )}
              {state.category && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => navigate({ category: undefined, page: 1 })}
                >
                  {state.category} ×
                </button>
              )}
              <button type="button" className="filter-chip-clear" onClick={clearAll}>
                {T("filter_clear_all")}
              </button>
            </div>
          )}

          {children}
        </div>
      </div>

      <BottomSheet
        open={sheet === "filter"}
        title={T("filter_filters")}
        onClose={() => setSheet(null)}
      >
        {hasFilters && (
          <button type="button" className="filter-clear-link mb-4" onClick={clearAll}>
            {T("filter_clear_all")}
          </button>
        )}
        <FilterPanelContent
          state={state}
          facets={facets}
          onNavigate={navigate}
          onPriceApply={handlePriceApply}
        />
        <button type="button" className="btn-primary mt-6 w-full" onClick={() => setSheet(null)}>
          {T("filter_show_results")} ({total})
        </button>
      </BottomSheet>

      <BottomSheet open={sheet === "sort"} title={T("filter_sort")} onClose={() => setSheet(null)}>
        <div className="space-y-1">
          {SORT_OPTIONS.map((key) => (
            <button
              key={key}
              type="button"
              className={`filter-sort-option ${state.sort === key ? "is-active" : ""}`}
              onClick={() => handleSort(key)}
            >
              {T(`filter_sort_${key}`)}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
