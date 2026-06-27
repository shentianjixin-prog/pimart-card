import type { Prisma } from "@/generated/prisma/client";
import type { Lang } from "@/lib/translations";
import { t } from "@/lib/translations";

export const PAGE_SIZE = 12;

export type SortKey =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "restocked";

export type ProductTypeKey = "sealed" | "psa" | "single" | "merch";
export type GameKey =
  | "pokemon"
  | "onepiece"
  | "naruto"
  | "yugioh"
  | "dragonball"
  | "other";
export type StockKey = "instock" | "preorder" | "soldout";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type FilterState = {
  type: ProductTypeKey[];
  game: GameKey[];
  language: string[];
  series: string[];
  rarity: string[];
  minPrice?: string;
  maxPrice?: string;
  stock: StockKey[];
  sort: SortKey;
  q?: string;
  page: number;
  /** @deprecated legacy single category */
  category?: string;
  /** @deprecated legacy boxType */
  boxType?: string;
};

export type Facet = { value: string; count: number };

export type FilterFacets = {
  languages: Facet[];
  series: Facet[];
  rarities: Facet[];
  games: { key: GameKey; count: number }[];
  types: { key: ProductTypeKey; count: number }[];
};

export const ACTIVE_PRODUCT: Prisma.ProductWhereInput = { status: "上架" };

export const PRODUCT_TYPES: ProductTypeKey[] = ["sealed", "psa", "single", "merch"];
export const GAMES: GameKey[] = [
  "pokemon",
  "onepiece",
  "naruto",
  "yugioh",
  "dragonball",
  "other",
];
export const STOCK_OPTIONS: StockKey[] = ["instock", "preorder", "soldout"];
export const SORT_OPTIONS: SortKey[] = [
  "featured",
  "newest",
  "price_asc",
  "price_desc",
  "popular",
  "restocked",
];

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function splitMulti(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSort(raw?: string): SortKey {
  if (raw && SORT_OPTIONS.includes(raw as SortKey)) return raw as SortKey;
  return "featured";
}

function legacyStock(raw: RawSearchParams): StockKey[] {
  const stock = splitMulti(firstParam(raw.stock));
  if (stock.length) return stock.filter((s): s is StockKey => STOCK_OPTIONS.includes(s as StockKey));
  const legacy: StockKey[] = [];
  if (firstParam(raw.inStock) === "1") legacy.push("instock");
  if (firstParam(raw.isPreorder) === "1") legacy.push("preorder");
  if (firstParam(raw.isPreorder) === "0" && !firstParam(raw.inStock)) {
    // legacy radio "现货 only" — treat as instock filter when explicitly set
  }
  return legacy;
}

export function parseFilterState(raw: RawSearchParams): FilterState {
  const type = splitMulti(firstParam(raw.type)).filter((v): v is ProductTypeKey =>
    PRODUCT_TYPES.includes(v as ProductTypeKey)
  );
  const game = splitMulti(firstParam(raw.game)).filter((v): v is GameKey =>
    GAMES.includes(v as GameKey)
  );
  const language = splitMulti(firstParam(raw.language));
  const series = splitMulti(firstParam(raw.series));
  const rarity = splitMulti(firstParam(raw.rarity));

  return {
    type,
    game,
    language,
    series,
    rarity,
    minPrice: firstParam(raw.minPrice),
    maxPrice: firstParam(raw.maxPrice),
    stock: legacyStock(raw),
    sort: parseSort(firstParam(raw.sort)),
    q: firstParam(raw.q),
    page: Math.max(1, Number(firstParam(raw.page)) || 1),
    category: firstParam(raw.category),
    boxType: firstParam(raw.boxType),
  };
}

export function isListingView(state: FilterState): boolean {
  return (
    state.type.length > 0 ||
    state.game.length > 0 ||
    state.language.length > 0 ||
    state.series.length > 0 ||
    state.rarity.length > 0 ||
    state.stock.length > 0 ||
    !!state.minPrice ||
    !!state.maxPrice ||
    !!state.q ||
    !!state.category ||
    !!state.boxType ||
    state.sort !== "featured" ||
    state.page > 1
  );
}

const PSA_WHERE: Prisma.ProductWhereInput = {
  OR: [
    { name: { contains: "PSA" } },
    { series: { contains: "PSA" } },
    { category: { contains: "PSA" } },
    { rarity: { contains: "PSA" } },
  ],
};

const MERCH_WHERE: Prisma.ProductWhereInput = {
  OR: [
    { category: { contains: "周边" } },
    { name: { contains: "卡套" } },
    { name: { contains: "卡册" } },
    { name: { contains: "收纳" } },
    { name: { contains: "スリーブ" } },
    { name: { contains: "バインダー" } },
  ],
};

export function typeWhere(key: ProductTypeKey): Prisma.ProductWhereInput {
  switch (key) {
    case "sealed":
      return {
        AND: [
          { boxType: { not: "" } },
          { NOT: PSA_WHERE },
        ],
      };
    case "psa":
      return PSA_WHERE;
    case "single":
      return {
        AND: [
          { boxType: "" },
          { NOT: PSA_WHERE },
          { NOT: MERCH_WHERE },
          {
            OR: [{ cardNumber: { not: null } }, { rarity: { not: null } }],
          },
        ],
      };
    case "merch":
      return MERCH_WHERE;
  }
}

export function gameWhere(key: GameKey): Prisma.ProductWhereInput {
  switch (key) {
    case "pokemon":
      return {
        OR: [
          { category: { contains: "宝可梦" } },
          { category: { contains: "ポケモン" } },
          { name: { contains: "宝可梦" } },
          { name: { contains: "Pokemon" } },
          { name: { contains: "ポケモン" } },
          { series: { contains: "宝可梦" } },
        ],
      };
    case "onepiece":
      return {
        OR: [
          { name: { contains: "One Piece" } },
          { name: { contains: "海贼王" } },
          { name: { contains: "ワンピース" } },
          { series: { contains: "One Piece" } },
        ],
      };
    case "naruto":
      return {
        OR: [
          { category: { contains: "火影" } },
          { name: { contains: "火影" } },
          { name: { contains: "NARUTO" } },
          { name: { contains: "Naruto" } },
        ],
      };
    case "yugioh":
      return {
        OR: [
          { name: { contains: "游戏王" } },
          { name: { contains: "遊戯王" } },
          { name: { contains: "Yu-Gi-Oh" } },
        ],
      };
    case "dragonball":
      return {
        OR: [
          { name: { contains: "龙珠" } },
          { name: { contains: "ドラゴンボール" } },
          { name: { contains: "Dragon Ball" } },
        ],
      };
    case "other":
      return {
        NOT: {
          OR: [
            ...(gameWhere("pokemon").OR as Prisma.ProductWhereInput[]),
            ...(gameWhere("onepiece").OR as Prisma.ProductWhereInput[]),
            ...(gameWhere("naruto").OR as Prisma.ProductWhereInput[]),
            ...(gameWhere("yugioh").OR as Prisma.ProductWhereInput[]),
            ...(gameWhere("dragonball").OR as Prisma.ProductWhereInput[]),
          ],
        },
      };
  }
}

function stockWhere(key: StockKey): Prisma.ProductWhereInput {
  switch (key) {
    case "instock":
      return { stock: { gt: 0 }, isPreorder: false };
    case "preorder":
      return { isPreorder: true };
    case "soldout":
      return { stock: { lte: 0 } };
  }
}

function multiOr(
  items: string[],
  field: "language" | "series" | "rarity"
): Prisma.ProductWhereInput | undefined {
  if (!items.length) return undefined;
  const key = field;
  return {
    OR: items.map((v) => ({ [key]: { contains: v } })),
  };
}

export function buildWhere(state: FilterState): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ ...ACTIVE_PRODUCT }];

  if (state.category) and.push({ category: state.category });
  if (state.boxType) and.push({ boxType: state.boxType });

  if (state.type.length) {
    and.push({ OR: state.type.map(typeWhere) });
  }
  if (state.game.length) {
    and.push({ OR: state.game.map(gameWhere) });
  }

  const langW = multiOr(state.language, "language");
  if (langW) and.push(langW);
  const seriesW = multiOr(state.series, "series");
  if (seriesW) and.push(seriesW);
  const rarityW = multiOr(state.rarity, "rarity");
  if (rarityW) and.push(rarityW);

  if (state.stock.length) {
    and.push({ OR: state.stock.map(stockWhere) });
  }

  if (state.minPrice || state.maxPrice) {
    and.push({
      priceJpy: {
        ...(state.minPrice ? { gte: Number(state.minPrice) } : {}),
        ...(state.maxPrice ? { lte: Number(state.maxPrice) } : {}),
      },
    });
  }

  if (state.q) {
    and.push({
      OR: [
        { name: { contains: state.q } },
        { series: { contains: state.q } },
        { cardNumber: { contains: state.q } },
        { rarity: { contains: state.q } },
        { language: { contains: state.q } },
        { category: { contains: state.q } },
      ],
    });
  }

  return and.length === 1 ? and[0]! : { AND: and };
}

export function buildOrderBy(
  sort: SortKey
): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return { priceJpy: "asc" };
    case "price_desc":
      return { priceJpy: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "popular":
      return [{ featured: "desc" }, { stock: "desc" }, { createdAt: "desc" }];
    case "restocked":
      return [{ priceUpdatedAt: "desc" }, { createdAt: "desc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

/** Serialize filter state → URL query (comma-separated multi-select) */
export function filterStateToParams(state: FilterState): Record<string, string> {
  const p: Record<string, string> = {};
  if (state.type.length) p.type = state.type.join(",");
  if (state.game.length) p.game = state.game.join(",");
  if (state.language.length) p.language = state.language.join(",");
  if (state.series.length) p.series = state.series.join(",");
  if (state.rarity.length) p.rarity = state.rarity.join(",");
  if (state.minPrice) p.minPrice = state.minPrice;
  if (state.maxPrice) p.maxPrice = state.maxPrice;
  if (state.stock.length) p.stock = state.stock.join(",");
  if (state.sort && state.sort !== "featured") p.sort = state.sort;
  if (state.q) p.q = state.q;
  if (state.page > 1) p.page = String(state.page);
  if (state.category) p.category = state.category;
  if (state.boxType) p.boxType = state.boxType;
  return p;
}

export function buildListingHref(
  state: FilterState,
  patch: Partial<FilterState> & { page?: number } = {}
): string {
  const next: FilterState = {
    ...state,
    ...patch,
    type: patch.type ?? state.type,
    game: patch.game ?? state.game,
    language: patch.language ?? state.language,
    series: patch.series ?? state.series,
    rarity: patch.rarity ?? state.rarity,
    stock: patch.stock ?? state.stock,
    page: patch.page ?? 1,
  };
  const usp = new URLSearchParams(filterStateToParams(next));
  const qs = usp.toString();
  return qs ? `/?${qs}` : "/";
}

export function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export type ActiveChip = {
  id: string;
  label: string;
  removePatch: Partial<FilterState>;
};

function typeLabel(key: ProductTypeKey, lang: Lang): string {
  return t(`filter_type_${key}`, lang);
}

function gameLabel(key: GameKey, lang: Lang): string {
  return t(`filter_game_${key}`, lang);
}

function stockLabel(key: StockKey, lang: Lang): string {
  if (key === "instock") return t("filter_instock", lang);
  if (key === "preorder") return t("filter_preorder", lang);
  return t("filter_stock_soldout", lang);
}

export function getActiveChips(state: FilterState, lang: Lang): ActiveChip[] {
  const chips: ActiveChip[] = [];

  for (const v of state.type) {
    chips.push({
      id: `type-${v}`,
      label: typeLabel(v, lang),
      removePatch: { type: state.type.filter((x) => x !== v) },
    });
  }
  for (const v of state.game) {
    chips.push({
      id: `game-${v}`,
      label: gameLabel(v, lang),
      removePatch: { game: state.game.filter((x) => x !== v) },
    });
  }
  for (const v of state.language) {
    chips.push({
      id: `lang-${v}`,
      label: v,
      removePatch: { language: state.language.filter((x) => x !== v) },
    });
  }
  for (const v of state.series) {
    chips.push({
      id: `series-${v}`,
      label: v,
      removePatch: { series: state.series.filter((x) => x !== v) },
    });
  }
  for (const v of state.rarity) {
    chips.push({
      id: `rarity-${v}`,
      label: v,
      removePatch: { rarity: state.rarity.filter((x) => x !== v) },
    });
  }
  for (const v of state.stock) {
    chips.push({
      id: `stock-${v}`,
      label: stockLabel(v, lang),
      removePatch: { stock: state.stock.filter((x) => x !== v) },
    });
  }
  if (state.minPrice || state.maxPrice) {
    const label =
      state.minPrice && state.maxPrice
        ? `¥${state.minPrice} – ¥${state.maxPrice}`
        : state.minPrice
          ? `≥ ¥${state.minPrice}`
          : `≤ ¥${state.maxPrice}`;
    chips.push({
      id: "price",
      label,
      removePatch: { minPrice: undefined, maxPrice: undefined },
    });
  }
  if (state.category) {
    chips.push({
      id: "category",
      label: state.category,
      removePatch: { category: undefined },
    });
  }
  if (state.boxType) {
    chips.push({
      id: "boxType",
      label: state.boxType,
      removePatch: { boxType: undefined },
    });
  }

  return chips;
}

export function sortLabel(sort: SortKey, lang: Lang): string {
  const map: Record<SortKey, string> = {
    featured: "filter_sort_featured",
    newest: "filter_sort_newest",
    price_asc: "filter_sort_asc",
    price_desc: "filter_sort_desc",
    popular: "filter_sort_popular",
    restocked: "filter_sort_restocked",
  };
  return t(map[sort], lang);
}
