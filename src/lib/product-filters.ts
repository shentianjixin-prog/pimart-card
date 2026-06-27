import type { Prisma } from "@/generated/prisma/client";
import type { Lang } from "@/lib/translations";
import { t } from "@/lib/translations";
import { normalizeSeriesId, seriesLabelById } from "@/lib/product-series";

export const PAGE_SIZE = 12;

export type SortKey =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "restocked";

export type ProductTypeKey = "sealed" | "psa" | "single" | "merch";
export type MainGameKey = "pokemon" | "onepiece" | "other";
export type SubGameKey =
  | "dragon-ball"
  | "naruto"
  | "yugioh"
  | "gundam"
  | "union-arena"
  | "weiss";
export type StockKey = "instock" | "preorder" | "soldout";

/** @deprecated legacy URL keys → migrated on parse */
export type LegacyGameKey = "naruto" | "yugioh" | "dragonball";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type FilterState = {
  type: ProductTypeKey[];
  game?: MainGameKey;
  subGame?: SubGameKey;
  language: string[];
  series: string[];
  rarity: string[];
  minPrice?: string;
  maxPrice?: string;
  stock: StockKey[];
  sort: SortKey;
  q?: string;
  page: number;
  category?: string;
  boxType?: string;
};

export type Facet = { value: string; count: number };

export type FilterFacets = {
  languages: Facet[];
  rarities: Facet[];
  games: { key: MainGameKey; count: number }[];
  types: { key: ProductTypeKey; count: number }[];
};

export const ACTIVE_PRODUCT: Prisma.ProductWhereInput = { status: "上架" };

export const PRODUCT_TYPES: ProductTypeKey[] = ["sealed", "psa", "single", "merch"];
export const MAIN_GAMES: MainGameKey[] = ["pokemon", "onepiece", "other"];
export const SUB_GAMES: SubGameKey[] = [
  "dragon-ball",
  "naruto",
  "yugioh",
  "gundam",
  "union-arena",
  "weiss",
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

const LEGACY_GAME_MAP: Record<string, { game: MainGameKey; subGame?: SubGameKey }> = {
  naruto: { game: "other", subGame: "naruto" },
  yugioh: { game: "other", subGame: "yugioh" },
  dragonball: { game: "other", subGame: "dragon-ball" },
};

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

function parseMainGame(raw?: string): MainGameKey | undefined {
  if (!raw) return undefined;
  const first = raw.split(",")[0]?.trim();
  if (first && MAIN_GAMES.includes(first as MainGameKey)) return first as MainGameKey;
  const legacy = LEGACY_GAME_MAP[first ?? ""];
  return legacy?.game;
}

function parseSubGame(raw?: string): SubGameKey | undefined {
  if (!raw) return undefined;
  const first = raw.split(",")[0]?.trim();
  if (first && SUB_GAMES.includes(first as SubGameKey)) return first as SubGameKey;
  return undefined;
}

function legacyStock(raw: RawSearchParams): StockKey[] {
  const stock = splitMulti(firstParam(raw.stock));
  if (stock.length) {
    return stock.filter((s): s is StockKey => STOCK_OPTIONS.includes(s as StockKey));
  }
  const legacy: StockKey[] = [];
  if (firstParam(raw.inStock) === "1") legacy.push("instock");
  if (firstParam(raw.isPreorder) === "1") legacy.push("preorder");
  return legacy;
}

export function parseFilterState(raw: RawSearchParams): FilterState {
  const type = splitMulti(firstParam(raw.type)).filter((v): v is ProductTypeKey =>
    PRODUCT_TYPES.includes(v as ProductTypeKey)
  );

  let game = parseMainGame(firstParam(raw.game));
  let subGame = parseSubGame(firstParam(raw.subGame));

  const legacyRaw = firstParam(raw.game);
  if (legacyRaw && LEGACY_GAME_MAP[legacyRaw.split(",")[0]?.trim() ?? ""]) {
    const mapped = LEGACY_GAME_MAP[legacyRaw.split(",")[0]!.trim()];
    game = mapped.game;
    subGame = mapped.subGame;
  }

  if (subGame && !game) game = "other";

  const series = splitMulti(firstParam(raw.series)).map(normalizeSeriesId);
  const language = splitMulti(firstParam(raw.language));
  const rarity = splitMulti(firstParam(raw.rarity));

  return {
    type,
    game,
    subGame: game === "other" ? subGame : undefined,
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
    !!state.game ||
    !!state.subGame ||
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
      return { AND: [{ boxType: { not: "" } }, { NOT: PSA_WHERE }] };
    case "psa":
      return PSA_WHERE;
    case "single":
      return {
        AND: [
          { boxType: "" },
          { NOT: PSA_WHERE },
          { NOT: MERCH_WHERE },
          { OR: [{ cardNumber: { not: null } }, { rarity: { not: null } }] },
        ],
      };
    case "merch":
      return MERCH_WHERE;
  }
}

const POKEMON_WHERE: Prisma.ProductWhereInput = {
  OR: [
    { category: { contains: "宝可梦" } },
    { category: { contains: "ポケモン" } },
    { name: { contains: "宝可梦" } },
    { name: { contains: "Pokemon" } },
    { name: { contains: "ポケモン" } },
    { series: { contains: "宝可梦" } },
  ],
};

const ONEPIECE_WHERE: Prisma.ProductWhereInput = {
  OR: [
    { name: { contains: "One Piece" } },
    { name: { contains: "海贼王" } },
    { name: { contains: "ワンピース" } },
    { series: { contains: "One Piece" } },
    { series: { contains: "OP" } },
  ],
};

export function subGameWhere(key: SubGameKey): Prisma.ProductWhereInput {
  switch (key) {
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
    case "dragon-ball":
      return {
        OR: [
          { name: { contains: "龙珠" } },
          { name: { contains: "ドラゴンボール" } },
          { name: { contains: "Dragon Ball" } },
          { series: { contains: "FB" } },
        ],
      };
    case "gundam":
      return {
        OR: [
          { name: { contains: "高达" } },
          { name: { contains: "ガンダム" } },
          { name: { contains: "Gundam" } },
        ],
      };
    case "union-arena":
      return {
        OR: [
          { name: { contains: "Union Arena" } },
          { series: { contains: "Union Arena" } },
        ],
      };
    case "weiss":
      return {
        OR: [
          { name: { contains: "Weiss Schwarz" } },
          { name: { contains: "ヴァイス" } },
        ],
      };
  }
}

const OTHER_TCG_WHERE: Prisma.ProductWhereInput = {
  NOT: { OR: [POKEMON_WHERE, ONEPIECE_WHERE] },
};

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

function seriesWhere(id: string): Prisma.ProductWhereInput {
  const label = seriesLabelById(undefined, undefined, id);
  const tokens = [id, label, label.replace(/\s+/g, " ")].filter(Boolean);
  const unique = [...new Set(tokens)];
  return {
    OR: unique.flatMap((token) => [
      { series: { contains: token } },
      { name: { contains: token } },
    ]),
  };
}

function multiOr(
  items: string[],
  field: "language" | "rarity"
): Prisma.ProductWhereInput | undefined {
  if (!items.length) return undefined;
  return { OR: items.map((v) => ({ [field]: { contains: v } })) };
}

export function buildWhere(state: FilterState): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ ...ACTIVE_PRODUCT }];

  if (state.category) and.push({ category: state.category });
  if (state.boxType) and.push({ boxType: state.boxType });

  if (state.type.length) and.push({ OR: state.type.map(typeWhere) });

  if (state.game === "pokemon") and.push(POKEMON_WHERE);
  else if (state.game === "onepiece") and.push(ONEPIECE_WHERE);
  else if (state.game === "other") {
    if (state.subGame) and.push(subGameWhere(state.subGame));
    else and.push(OTHER_TCG_WHERE);
  }

  const langW = multiOr(state.language, "language");
  if (langW) and.push(langW);

  if (state.series.length) {
    and.push({ OR: state.series.map(seriesWhere) });
  }

  const rarityW = multiOr(state.rarity, "rarity");
  if (rarityW) and.push(rarityW);

  if (state.stock.length) and.push({ OR: state.stock.map(stockWhere) });

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

export function applyFilterPatch(
  state: FilterState,
  patch: Partial<FilterState> & { page?: number }
): FilterState {
  const next: FilterState = {
    ...state,
    ...patch,
    type: patch.type ?? state.type,
    language: patch.language ?? state.language,
    series: patch.series ?? state.series,
    rarity: patch.rarity ?? state.rarity,
    stock: patch.stock ?? state.stock,
    page: patch.page ?? 1,
  };

  if ("game" in patch) {
    const newGame = patch.game;
    if (newGame !== state.game) {
      if (!("series" in patch)) next.series = [];
      if (!("subGame" in patch)) next.subGame = undefined;
    }
    if (newGame !== "other") next.subGame = undefined;
  }

  if ("subGame" in patch && patch.subGame !== state.subGame) {
    if (!("series" in patch)) next.series = [];
  }

  if (next.game !== "other") next.subGame = undefined;

  return next;
}

export function filterStateToParams(state: FilterState): Record<string, string> {
  const p: Record<string, string> = {};
  if (state.type.length) p.type = state.type.join(",");
  if (state.game) p.game = state.game;
  if (state.game === "other" && state.subGame) p.subGame = state.subGame;
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
  const next = applyFilterPatch(state, patch);
  const usp = new URLSearchParams(filterStateToParams(next));
  const qs = usp.toString();
  return qs ? `/?${qs}` : "/";
}

export function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function subGameLabel(key: SubGameKey, lang: Lang): string {
  return t(`filter_subgame_${key.replace(/-/g, "_")}`, lang);
}

export function mainGameLabel(key: MainGameKey, lang: Lang): string {
  return t(`filter_game_${key}`, lang);
}

export function sortLabel(sort: SortKey, lang: Lang): string {
  const map: Record<SortKey, string> = {
    featured: "filter_sort_featured",
    newest: "filter_sort_newest",
    price_asc: "filter_sort_price_asc",
    price_desc: "filter_sort_price_desc",
    popular: "filter_sort_popular",
    restocked: "filter_sort_restocked",
  };
  return t(map[sort], lang);
}

/** @deprecated use subGameWhere */
export function gameWhere(key: string): Prisma.ProductWhereInput {
  if (key === "pokemon") return POKEMON_WHERE;
  if (key === "onepiece") return ONEPIECE_WHERE;
  if (key === "other") return OTHER_TCG_WHERE;
  const legacy = LEGACY_GAME_MAP[key];
  if (legacy?.subGame) return subGameWhere(legacy.subGame);
  return OTHER_TCG_WHERE;
}
