"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang, useT } from "@/lib/lang-context";
import { getSeriesPanelState } from "@/lib/product-series";
import {
  type FilterFacets,
  type FilterState,
  type MainGameKey,
  type SortKey,
  type StockKey,
  type SubGameKey,
  MAIN_GAMES,
  SORT_OPTIONS,
  STOCK_OPTIONS,
  SUB_GAMES,
  applyFilterPatch,
  buildListingHref,
  filterStateToParams,
  productTypesForGame,
  selectOnlyInList,
  subGameLabel,
} from "@/lib/product-filters";

type Props = {
  state: FilterState;
  facets: FilterFacets;
  subGameCounts: Record<string, number>;
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

function PillOption({
  selected,
  label,
  count,
  onClick,
  size = "default",
}: {
  selected: boolean;
  label: string;
  count?: number;
  onClick: () => void;
  size?: "default" | "sub";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-pill ${selected ? "filter-pill-selected" : ""} ${
        size === "sub" ? "filter-pill-sub" : ""
      }`}
    >
      {label}
      {typeof count === "number" && count > 0 && (
        <span className="filter-pill-count">{count}</span>
      )}
    </button>
  );
}

function GameFilterSection({
  draft,
  facets,
  subGameCounts,
  onSelectGame,
  onSelectSubGame,
  lang,
}: {
  draft: FilterState;
  facets: FilterFacets;
  subGameCounts: Record<string, number>;
  onSelectGame: (game: MainGameKey) => void;
  onSelectSubGame: (sub: SubGameKey) => void;
  lang: "zh" | "ja" | "en";
}) {
  const T = useT();

  return (
    <FilterSection title={T("filter_game")}>
      <div className="flex flex-wrap gap-2">
        {MAIN_GAMES.filter((g) => g !== "other").map((key) => {
          const facet = facets.games.find((f) => f.key === key);
          const selected = draft.game === key;
          return (
            <PillOption
              key={key}
              selected={selected}
              label={T(`filter_game_${key}`)}
              count={facet?.count}
              onClick={() => onSelectGame(key)}
            />
          );
        })}
        {SUB_GAMES.map((key) => {
          const selected = draft.game === "other" && draft.subGame === key;
          return (
            <PillOption
              key={key}
              selected={selected}
              label={subGameLabel(key, lang)}
              count={subGameCounts[key]}
              onClick={() => onSelectSubGame(key)}
            />
          );
        })}
      </div>
    </FilterSection>
  );
}

function SeriesFilterSection({
  draft,
  onToggleSeries,
}: {
  draft: FilterState;
  onToggleSeries: (id: string) => void;
}) {
  const T = useT();
  const panel = getSeriesPanelState(draft.game, draft.subGame);

  if (panel.kind === "hidden") return null;

  return (
    <FilterSection title={T("filter_series")}>
      {panel.kind === "hint" ? (
        <p className="filter-series-hint">{T(panel.messageKey)}</p>
      ) : panel.options.length === 0 ? (
        <p className="filter-series-hint">{T("filter_series_empty")}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {panel.options.map(({ id, label }) => (
            <PillOption
              key={id}
              selected={draft.series.includes(id)}
              label={label}
              onClick={() => onToggleSeries(id)}
            />
          ))}
        </div>
      )}
    </FilterSection>
  );
}

function FilterPanelContent({
  draft,
  facets,
  subGameCounts,
  onPatch,
  onPriceDraft,
  lang,
}: {
  draft: FilterState;
  facets: FilterFacets;
  subGameCounts: Record<string, number>;
  onPatch: (patch: Partial<FilterState>) => void;
  onPriceDraft: (min: string, max: string) => void;
  lang: "zh" | "ja" | "en";
}) {
  const T = useT();
  const [minPrice, setMinPrice] = useState(draft.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(draft.maxPrice ?? "");

  useEffect(() => {
    setMinPrice(draft.minPrice ?? "");
    setMaxPrice(draft.maxPrice ?? "");
  }, [draft.minPrice, draft.maxPrice]);

  const selectGame = (game: MainGameKey) => {
    if (draft.game === game) {
      onPatch({ game: undefined, subGame: undefined, series: [], type: [] });
    } else {
      onPatch({ game, subGame: undefined, series: [], type: [] });
    }
  };

  const selectSubGame = (subGame: SubGameKey) => {
    if (draft.subGame === subGame) {
      onPatch({ game: undefined, subGame: undefined, series: [], type: [] });
    } else {
      onPatch({ game: "other", subGame, series: [], type: [] });
    }
  };

  const showProductType =
    draft.game === "pokemon" ||
    draft.game === "onepiece" ||
    (draft.game === "other" && !!draft.subGame);
  const showSeries = showProductType && draft.type.includes("expansion");

  return (
    <div className="filter-panel-inner">
      <GameFilterSection
        draft={draft}
        facets={facets}
        subGameCounts={subGameCounts}
        onSelectGame={selectGame}
        onSelectSubGame={selectSubGame}
        lang={lang}
      />

      <FilterSection title={T("filter_stock")}>
        <div className="flex flex-wrap gap-2">
          {STOCK_OPTIONS.map((key) => (
            <PillOption
              key={key}
              selected={draft.stock.includes(key)}
              label={
                key === "instock"
                  ? T("filter_instock")
                  : key === "preorder"
                    ? T("filter_preorder")
                    : T("filter_stock_soldout")
              }
              onClick={() =>
                onPatch({ stock: selectOnlyInList(draft.stock, key as StockKey), page: 1 })
              }
            />
          ))}
        </div>
      </FilterSection>

      {showProductType && (
        <FilterSection title={T("filter_product_type")}>
          <div className="flex flex-wrap gap-2">
            {productTypesForGame(draft.game).map((key) => {
              const facet = facets.types.find((f) => f.key === key);
              return (
                <PillOption
                  key={key}
                  selected={draft.type.includes(key)}
                  label={T(`filter_type_${key}`)}
                  count={facet?.count}
                  onClick={() => {
                    const nextType = selectOnlyInList(draft.type, key);
                    onPatch({
                      type: nextType,
                      // 取消扩充包时同步清空系列
                      series: nextType.includes("expansion") ? draft.series : [],
                      page: 1,
                    });
                  }}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      {showSeries && (
        <SeriesFilterSection
          draft={draft}
          onToggleSeries={(id) =>
            onPatch({ series: selectOnlyInList(draft.series, id), page: 1 })
          }
        />
      )}

      <FilterSection title={T("filter_price")}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={T("filter_price_min")}
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              onPriceDraft(e.target.value, maxPrice);
            }}
            className="input-field w-1/2"
          />
          <span className="text-[#9ca3af]">~</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={T("filter_price_max")}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              onPriceDraft(minPrice, e.target.value);
            }}
            className="input-field w-1/2"
          />
        </div>
      </FilterSection>
    </div>
  );
}

function BottomSheet({
  open,
  title,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
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
        {footer && <div className="filter-sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ProductListingControls({
  state,
  facets,
  subGameCounts,
  total,
  children,
}: Props) {
  const T = useT();
  const { lang } = useLang();
  const router = useRouter();
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [mobileDraft, setMobileDraft] = useState<FilterState>(state);

  useEffect(() => {
    if (sheet !== "filter") setMobileDraft(state);
  }, [state, sheet]);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [sortOpen]);

  const navigate = useCallback(
    (patch: Partial<FilterState>) => {
      router.push(buildListingHref(state, patch));
    },
    [router, state]
  );

  const handleSort = (sort: SortKey) => {
    navigate({ sort, page: 1 });
    setSheet(null);
    setSortOpen(false);
  };

  const openFilters = () => {
    // 桌面：切换侧栏；移动端：打开筛选抽屉
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      setFiltersOpen((v) => !v);
      return;
    }
    setSheet("filter");
  };

  const clearAll = () => {
    router.push(state.q ? `/?q=${encodeURIComponent(state.q)}` : "/?stock=instock");
    setSheet(null);
  };

  const applyMobileDraft = () => {
    const p = filterStateToParams({ ...mobileDraft, page: 1 });
    const qs = new URLSearchParams(p).toString();
    router.push(qs ? `/?${qs}` : "/?stock=instock");
    setSheet(null);
  };

  const clearMobileDraft = () => {
    setMobileDraft({
      type: [],
      game: undefined,
      subGame: undefined,
      language: [],
      series: [],
      rarity: [],
      stock: [],
      minPrice: undefined,
      maxPrice: undefined,
      sort: state.sort,
      q: state.q,
      page: 1,
    });
  };

  const desktopPatch = (patch: Partial<FilterState>) => navigate(patch);

  const mobilePatch = (patch: Partial<FilterState>) => {
    setMobileDraft((prev) => applyFilterPatch(prev, patch));
  };

  const hasFilters =
    state.type.length > 0 ||
    !!state.game ||
    !!state.subGame ||
    state.series.length > 0 ||
    state.rarity.length > 0 ||
    state.stock.length > 0 ||
    !!state.minPrice ||
    !!state.maxPrice;

  return (
    <>
      <div className="filter-control-bar">
        <button
          type="button"
          className="filter-show-btn"
          onClick={openFilters}
          aria-expanded={filtersOpen}
        >
          <span>{T("filter_show")}</span>
          {hasFilters && <span className="filter-show-btn-dot" aria-hidden />}
          <svg className="filter-show-btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h9M17 7h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="15.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 12h3M11 12h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="8.5" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 17h7M15 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="13.5" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        <div className="filter-sort-wrap" ref={sortRef}>
          <button
            type="button"
            className="filter-sort-trigger"
            onClick={() => setSortOpen((v) => !v)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
          >
            <span>{T("filter_sort")}</span>
            <svg
              className={`filter-sort-chevron ${sortOpen ? "is-open" : ""}`}
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {sortOpen && (
            <div className="filter-sort-menu" role="listbox" aria-label={T("filter_sort")}>
              {SORT_OPTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={state.sort === key}
                  className={`filter-sort-menu-item ${state.sort === key ? "is-active" : ""}`}
                  onClick={() => handleSort(key)}
                >
                  {T(`filter_sort_${key}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="filter-control-count">
          <span className="font-semibold text-[#111827]">{total}</span>
          {T("page_total_unit")}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {filtersOpen && (
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
              draft={state}
              facets={facets}
              subGameCounts={subGameCounts}
              onPatch={desktopPatch}
              onPriceDraft={(min, max) =>
                desktopPatch({
                  minPrice: min || undefined,
                  maxPrice: max || undefined,
                  page: 1,
                })
              }
              lang={lang}
            />
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>

      <BottomSheet
        open={sheet === "filter"}
        title={T("filter_filters")}
        onClose={() => setSheet(null)}
        footer={
          <div className="filter-sheet-actions">
            <button type="button" className="btn-secondary flex-1" onClick={clearMobileDraft}>
              {T("filter_clear_all")}
            </button>
            <button type="button" className="btn-primary flex-1" onClick={applyMobileDraft}>
              {T("filter_apply")} ({total})
            </button>
          </div>
        }
      >
        <FilterPanelContent
          draft={mobileDraft}
          facets={facets}
          subGameCounts={subGameCounts}
          onPatch={mobilePatch}
          onPriceDraft={(min, max) =>
            mobilePatch({
              minPrice: min || undefined,
              maxPrice: max || undefined,
              page: 1,
            })
          }
          lang={lang}
        />
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
