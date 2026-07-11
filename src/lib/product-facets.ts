import { prisma } from "@/lib/prisma";
import {
  type FilterFacets,
  type MainGameKey,
  MAIN_GAMES,
  LISTING_PRODUCT,
  productTypesForGame,
  typeWhere,
  subGameWhere,
  gameWhere,
} from "@/lib/product-filters";

const ACTIVE = LISTING_PRODUCT;

async function countForGame(key: MainGameKey) {
  return prisma.product.count({
    where: { AND: [LISTING_PRODUCT, gameWhere(key)] },
  });
}

export async function fetchFilterFacets(game?: MainGameKey): Promise<FilterFacets> {
  const typeKeys = productTypesForGame(game);
  const scopedGame = game ? gameWhere(game) : undefined;

  const [rarityGroups, typeCounts, gameCounts] = await Promise.all([
    prisma.product.groupBy({
      by: ["rarity"],
      where: {
        ...ACTIVE,
        rarity: { not: null },
        ...(scopedGame ? { AND: [scopedGame] } : {}),
      },
      _count: { _all: true },
    }),
    Promise.all(
      typeKeys.map(async (key) => ({
        key,
        count: await prisma.product.count({
          where: {
            AND: [LISTING_PRODUCT, typeWhere(key), ...(scopedGame ? [scopedGame] : [])],
          },
        }),
      }))
    ),
    Promise.all(
      MAIN_GAMES.map(async (key) => ({
        key,
        count: await countForGame(key),
      }))
    ),
  ]);

  return {
    rarities: rarityGroups
      .filter((g) => g.rarity)
      .map((g) => ({ value: g.rarity!, count: g._count._all }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    types: typeCounts,
    games: gameCounts,
  };
}

/** 子游戏商品数（侧栏展示，失败时返回 0） */
export async function fetchSubGameCounts(): Promise<Record<string, number>> {
  const keys = [
    "dragon-ball",
    "naruto",
    "yugioh",
    "gundam",
    "union-arena",
    "weiss",
  ] as const;

  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        const count = await prisma.product.count({
          where: { AND: [LISTING_PRODUCT, subGameWhere(key)] },
        });
        return [key, count] as const;
      } catch {
        return [key, 0] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}
