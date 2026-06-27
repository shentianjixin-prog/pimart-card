import type { MainGameKey, SubGameKey } from "@/lib/product-filters";

export type SeriesOption = { id: string; label: string };

/** URL / query 用小写 id，展示用 label */
export const POKEMON_SERIES: SeriesOption[] = [
  { id: "151", label: "151" },
  { id: "sv", label: "SV" },
  { id: "sv8a", label: "SV8a" },
  { id: "sv9", label: "SV9" },
  { id: "sv10", label: "SV10" },
  { id: "m1", label: "M1" },
  { id: "m2", label: "M2" },
  { id: "m3", label: "M3" },
  { id: "m4", label: "M4" },
  { id: "m5", label: "M5" },
  { id: "gem-pack", label: "Gem Pack" },
];

export const ONEPIECE_SERIES: SeriesOption[] = [
  "OP01", "OP02", "OP03", "OP04", "OP05", "OP06", "OP07",
  "OP08", "OP09", "OP10", "OP11", "OP12", "OP13", "EB", "PRB",
].map((label) => ({ id: label.toLowerCase(), label }));

export const SUBGAME_SERIES: Record<SubGameKey, SeriesOption[]> = {
  "dragon-ball": [
    "FB01", "FB02", "FB03", "FB04", "FB05", "FB06",
  ].map((label) => ({ id: label.toLowerCase(), label })),
  naruto: [
    { id: "naruto", label: "NARUTO" },
    { id: "bp", label: "BP" },
    { id: "nrt", label: "NRT" },
    { id: "shippuden", label: "疾风传" },
  ],
  yugioh: [
    { id: "ocg", label: "OCG" },
    { id: "rush-duel", label: "Rush Duel" },
    { id: "structure-deck", label: "Structure Deck" },
  ],
  gundam: [
    { id: "gd01", label: "GD01" },
    { id: "st01", label: "ST01" },
    { id: "st02", label: "ST02" },
    { id: "st03", label: "ST03" },
  ],
  "union-arena": [
    { id: "ua", label: "UA" },
    { id: "ue", label: "UE" },
    { id: "promo", label: "Promo" },
  ],
  weiss: [
    { id: "ws", label: "WS" },
    { id: "bp", label: "BP" },
    { id: "trial", label: "Trial Deck" },
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
  if (!game) {
    return { kind: "hint", messageKey: "filter_series_select_game" };
  }
  if (game === "pokemon") {
    return { kind: "list", options: POKEMON_SERIES };
  }
  if (game === "onepiece") {
    return { kind: "list", options: ONEPIECE_SERIES };
  }
  if (game === "other") {
    if (!subGame) {
      return { kind: "hint", messageKey: "filter_series_select_subgame" };
    }
    const options = SUBGAME_SERIES[subGame] ?? [];
    if (options.length === 0) {
      return { kind: "hint", messageKey: "filter_series_empty" };
    }
    return { kind: "list", options };
  }
  return { kind: "hidden" };
}

export function seriesLabelById(
  game: MainGameKey | undefined,
  subGame: SubGameKey | undefined,
  id: string
): string {
  const panel = getSeriesPanelState(game, subGame);
  if (panel.kind === "list") {
    const hit = panel.options.find((o) => o.id === id.toLowerCase());
    if (hit) return hit.label;
  }
  return id.toUpperCase();
}

export function normalizeSeriesId(raw: string): string {
  return raw.trim().toLowerCase();
}
