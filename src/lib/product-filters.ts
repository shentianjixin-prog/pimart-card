import type { Prisma } from "@/generated/prisma/client";
import type { Lang } from "@/lib/translations";
import { t } from "@/lib/translations";
import { normalizeSeriesId, seriesMatchTokens } from "@/lib/product-series";

export const PAGE_SIZE = 12;

export type SortKey =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "restocked";

/** 扩充包 / 礼盒 / 周边 / 套装 / 挂盒（挂盒主要用于海贼王） */
export type ProductTypeKey = "expansion" | "gift" | "merch" | "set" | "hang";
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
  /** @deprecated 语言筛选已移除，保留字段仅兼容旧 URL */
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
  rarities: Facet[];
  games: { key: MainGameKey; count: number }[];
  types: { key: ProductTypeKey; count: number }[];
};

export const ACTIVE_PRODUCT: Prisma.ProductWhereInput = { status: "上架" };

/**
 * 规格附属 SKU（散包/原箱等）不单独出现在首页与列表，
 * 仅作为同款商品的详情/「即刻购买」选项。
 */
export const VARIANT_ONLY_BOX_TYPES = [
  "散包",
  "原箱",
  "肥散包",
  "瘦散包",
  "肥原箱",
  "瘦原箱",
  "瘦盒", // 朱紫瘦盒规格附属，列表只展示肥盒主 SKU
] as const;

/** 前台列表 / 首页用：上架且排除规格附属 SKU */
export const LISTING_PRODUCT: Prisma.ProductWhereInput = {
  status: "上架",
  NOT: { boxType: { in: [...VARIANT_ONLY_BOX_TYPES] } },
};

/** 默认（宝可梦 / 全站）：扩充包 / 礼盒 / 周边 / 套装 */
export const PRODUCT_TYPES: ProductTypeKey[] = ["expansion", "gift", "merch", "set"];

/** 海贼王：扩充包 / 礼盒 / 挂盒 */
export const ONEPIECE_PRODUCT_TYPES: ProductTypeKey[] = ["expansion", "gift", "hang"];

export function productTypesForGame(game?: MainGameKey): ProductTypeKey[] {
  if (game === "onepiece") return ONEPIECE_PRODUCT_TYPES;
  return PRODUCT_TYPES;
}

/** 旧 URL type= 映射 */
const LEGACY_TYPE_MAP: Record<string, ProductTypeKey | undefined> = {
  sealed: "expansion",
  psa: undefined,
  single: undefined,
  merch: "merch",
  expansion: "expansion",
  gift: "gift",
  set: "set",
  hang: "hang",
};
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

function parseProductTypes(raw?: string): ProductTypeKey[] {
  const allKnown: ProductTypeKey[] = ["expansion", "gift", "merch", "set", "hang"];
  const out: ProductTypeKey[] = [];
  for (const v of splitMulti(raw)) {
    const mapped =
      LEGACY_TYPE_MAP[v] ?? (allKnown.includes(v as ProductTypeKey) ? (v as ProductTypeKey) : undefined);
    if (mapped && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

export function parseFilterState(raw: RawSearchParams): FilterState {
  let type = parseProductTypes(firstParam(raw.type));

  let game = parseMainGame(firstParam(raw.game));
  let subGame = parseSubGame(firstParam(raw.subGame));

  const legacyRaw = firstParam(raw.game);
  if (legacyRaw && LEGACY_GAME_MAP[legacyRaw.split(",")[0]?.trim() ?? ""]) {
    const mapped = LEGACY_GAME_MAP[legacyRaw.split(",")[0]!.trim()];
    game = mapped.game;
    subGame = mapped.subGame;
  }

  if (subGame && !game) game = "other";

  const allowedTypes = new Set(productTypesForGame(game));
  type = type.filter((k) => allowedTypes.has(k));

  const series = splitMulti(firstParam(raw.series)).map(normalizeSeriesId);
  const rarity = splitMulti(firstParam(raw.rarity));

  return {
    type,
    game,
    subGame: game === "other" ? subGame : undefined,
    language: [],
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

const MERCH_WHERE: Prisma.ProductWhereInput = {
  OR: [
    { boxType: { in: ["其他"] } },
    { category: { contains: "周边" } },
    { name: { contains: "卡套" } },
    { name: { contains: "卡册" } },
    { name: { contains: "收纳" } },
    { name: { contains: "スリーブ" } },
    { name: { contains: "バインダー" } },
  ],
};

/** 扩充包：补充包/强化包/宝石包/OPC 原盒散包原箱等 */
const EXPANSION_BOX_TYPES = [
  "肥盒",
  "瘦盒",
  "肥散包",
  "瘦散包",
  "肥原箱",
  "瘦原箱",
  "宝石包",
  "原盒",
  "散包",
  "原箱",
  "特别版",
  "补充包(肥盒)",
  "补充包(瘦盒)",
  "强化包(瘦盒)",
  "强化扩张包",
] as const;

const GIFT_BOX_TYPES = ["礼盒", "专属礼盒", "大礼盒"] as const;

/** 挂盒：预组牌组 / 显式挂盒（海贼王 STC 等） */
const HANG_BOX_TYPES = ["挂盒", "预组"] as const;

export function typeWhere(key: ProductTypeKey): Prisma.ProductWhereInput {
  switch (key) {
    case "expansion":
      return { boxType: { in: [...EXPANSION_BOX_TYPES] } };
    case "gift":
      return { boxType: { in: [...GIFT_BOX_TYPES] } };
    case "set":
      // 预组归挂盒后，套装不再含预组，避免海贼王重复归类
      return { boxType: { in: ["对战套装", "构筑套装", "卡组"] } };
    case "hang":
      return {
        OR: [
          { boxType: { in: [...HANG_BOX_TYPES] } },
          { name: { contains: "挂盒" } },
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
  AND: [
    {
      OR: [
        { category: { contains: "海贼王" } },
        { category: { contains: "ワンピース" } },
        { category: { contains: "One Piece" } },
        { name: { startsWith: "OPC-" } },
        { name: { startsWith: "EBC-" } },
        { name: { startsWith: "STC-" } },
        { name: { startsWith: "PRB" } },
        { series: { startsWith: "OPC-" } },
        { series: { startsWith: "EBC-" } },
        { series: { startsWith: "STC-" } },
        { series: { startsWith: "PRB" } },
      ],
    },
    // 避免 NARUTOP 等被 series contains "OP" 误伤
    {
      NOT: {
        OR: [
          { name: { contains: "NARUTO" } },
          { name: { contains: "火影" } },
          { series: { contains: "NARUTO" } },
        ],
      },
    },
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

function seriesWhere(
  id: string,
  game?: MainGameKey,
  subGame?: SubGameKey
): Prisma.ProductWhereInput {
  const tokens = seriesMatchTokens(game, subGame, id);
  const unique = [...new Set(tokens.filter(Boolean))];
  return {
    OR: unique.flatMap((token) => [
      { series: { contains: token } },
      { name: { contains: token } },
    ]),
  };
}

function multiOr(
  items: string[],
  field: "rarity"
): Prisma.ProductWhereInput | undefined {
  if (!items.length) return undefined;
  return { OR: items.map((v) => ({ [field]: { contains: v } })) };
}

export function buildWhere(state: FilterState): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ ...LISTING_PRODUCT }];

  if (state.category) and.push({ category: state.category });
  if (state.boxType) and.push({ boxType: state.boxType });

  if (state.type.length) and.push({ OR: state.type.map(typeWhere) });

  if (state.game === "pokemon") and.push(POKEMON_WHERE);
  else if (state.game === "onepiece") and.push(ONEPIECE_WHERE);
  else if (state.game === "other") {
    if (state.subGame) and.push(subGameWhere(state.subGame));
    else and.push(OTHER_TCG_WHERE);
  }

  if (state.series.length) {
    and.push({
      OR: state.series.map((id) => seriesWhere(id, state.game, state.subGame)),
    });
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
      // 按发售日优先（OPC-16/15 等新品在前），无发售日再按创建时间
      return [{ releaseDate: "desc" }, { createdAt: "desc" }];
    case "popular":
      return [{ featured: "desc" }, { stock: "desc" }, { releaseDate: "desc" }, { createdAt: "desc" }];
    case "restocked":
      return [{ priceUpdatedAt: "desc" }, { createdAt: "desc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { releaseDate: "desc" }, { createdAt: "desc" }];
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
      // 切换游戏时丢掉不适用于该游戏的商品类型
      if (!("type" in patch)) {
        const allowed = new Set(productTypesForGame(newGame));
        next.type = next.type.filter((k) => allowed.has(k));
      }
    }
    if (newGame !== "other") next.subGame = undefined;
  }

  if ("subGame" in patch && patch.subGame !== state.subGame) {
    if (!("series" in patch)) next.series = [];
  }

  if (next.game !== "other") next.subGame = undefined;

  // 兜底：只保留当前游戏允许的类型
  {
    const allowed = new Set(productTypesForGame(next.game));
    next.type = next.type.filter((k) => allowed.has(k));
  }

  return next;
}

export function filterStateToParams(state: FilterState): Record<string, string> {
  const p: Record<string, string> = {};
  if (state.type.length) p.type = state.type.join(",");
  if (state.game) p.game = state.game;
  if (state.game === "other" && state.subGame) p.subGame = state.subGame;
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
