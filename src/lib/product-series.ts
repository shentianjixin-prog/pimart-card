import type { MainGameKey, SubGameKey } from "@/lib/product-filters";

export type SeriesOption = {
  id: string;
  label: string;
  /** 匹配 series / name 的关键词（默认用 id + label） */
  match?: string[];
};

/** 大版本分类（对齐网站数据.xlsx 分组） */
export const POKEMON_SERIES: SeriesOption[] = [
  { id: "sun-moon", label: "太阳&月亮", match: ["太阳&月亮"] },
  { id: "sword-shield", label: "剑&盾", match: ["剑&盾"] },
  { id: "scarlet-violet", label: "朱・紫", match: ["朱・紫", "朱紫"] },
  { id: "151", label: "151", match: ["151", "收集啦151"] },
  { id: "gem-pack", label: "宝石包", match: ["宝石包"] },
];

export const ONEPIECE_SERIES: SeriesOption[] = [
  { id: "opc", label: "OP补充包", match: ["OPC-"] },
  { id: "ebc", label: "EB补充包", match: ["EBC-"] },
  { id: "prbc", label: "prb典藏包", match: ["PRBC-", "PRB"] },
];

export const SUBGAME_SERIES: Record<SubGameKey, SeriesOption[]> = {
  "dragon-ball": [
    "FB01",
    "FB02",
    "FB03",
    "FB04",
    "FB05",
    "FB06",
  ].map((label) => ({ id: label.toLowerCase(), label, match: [label] })),
  naruto: [
    { id: "kayou", label: "卡游 / 官方", match: ["NARUTOP", "疾風", "疾风"] },
    { id: "expansion", label: "系列扩展", match: ["游历"] },
    { id: "gift-merch", label: "礼盒 / 周边", match: ["礼盒", "周边", "入门套装"] },
  ],
  yugioh: [
    { id: "ocg", label: "OCG", match: ["OCG"] },
    { id: "rush-duel", label: "Rush Duel", match: ["Rush Duel"] },
    { id: "structure-deck", label: "Structure Deck", match: ["Structure Deck"] },
  ],
  gundam: [
    { id: "gd01", label: "GD01", match: ["GD01"] },
    { id: "st01", label: "ST01", match: ["ST01"] },
    { id: "st02", label: "ST02", match: ["ST02"] },
    { id: "st03", label: "ST03", match: ["ST03"] },
  ],
  "union-arena": [
    { id: "ua", label: "UA", match: ["UA"] },
    { id: "ue", label: "UE", match: ["UE"] },
    { id: "promo", label: "Promo", match: ["Promo"] },
  ],
  weiss: [
    { id: "ws", label: "WS", match: ["WS"] },
    { id: "bp", label: "BP", match: ["BP"] },
    { id: "trial", label: "Trial Deck", match: ["Trial Deck"] },
  ],
};

export type SeriesPanelState =
  | { kind: "hidden" }
  | { kind: "hint"; messageKey: string }
  | { kind: "list"; options: SeriesOption[] };

export function getSeriesPanelState(
  game?: MainGameKey,
  subGame?: SubGameKey
): SeriesPanelState {
  // 未选游戏时不展示系列区块
  if (!game) {
    return { kind: "hidden" };
  }
  if (game === "pokemon") {
    return { kind: "list", options: POKEMON_SERIES };
  }
  if (game === "onepiece") {
    return { kind: "list", options: ONEPIECE_SERIES };
  }
  if (game === "other") {
    // 需先点到具体 IP（火影 / 龙珠等）
    if (!subGame) {
      return { kind: "hidden" };
    }
    const options = SUBGAME_SERIES[subGame] ?? [];
    if (options.length === 0) {
      return { kind: "hint", messageKey: "filter_series_empty" };
    }
    return { kind: "list", options };
  }
  return { kind: "hidden" };
}

function findSeriesOption(
  game: MainGameKey | undefined,
  subGame: SubGameKey | undefined,
  id: string
): SeriesOption | undefined {
  const needle = id.toLowerCase();
  const panel = getSeriesPanelState(game, subGame);
  const all = [
    ...(panel.kind === "list" ? panel.options : []),
    ...POKEMON_SERIES,
    ...ONEPIECE_SERIES,
    ...Object.values(SUBGAME_SERIES).flat(),
  ];
  // 去重保序
  const seen = new Set<string>();
  const uniq: SeriesOption[] = [];
  for (const o of all) {
    if (seen.has(o.id)) continue;
    seen.add(o.id);
    uniq.push(o);
  }
  return (
    uniq.find((o) => o.id === needle) ||
    uniq.find((o) => o.label === id) ||
    uniq.find((o) => o.label.toLowerCase() === needle)
  );
}

export function seriesLabelById(
  game: MainGameKey | undefined,
  subGame: SubGameKey | undefined,
  id: string
): string {
  return findSeriesOption(game, subGame, id)?.label ?? id;
}

export function seriesMatchTokens(
  game: MainGameKey | undefined,
  subGame: SubGameKey | undefined,
  id: string
): string[] {
  const option = findSeriesOption(game, subGame, id);
  if (option?.match?.length) return option.match;
  if (option) return [option.id, option.label];
  return [id];
}

export function normalizeSeriesId(raw: string): string {
  return raw.trim().toLowerCase();
}
