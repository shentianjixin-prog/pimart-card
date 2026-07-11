import { prisma } from "@/lib/prisma";
import {
  type FilterFacets,
  MAIN_GAMES,
  PRODUCT_TYPES,
  ACTIVE_PRODUCT,
  typeWhere,
  subGameWhere,
} from "@/lib/product-filters";

const ACTIVE = { status: "上架" as const };

const POKEMON_WHERE = {
  OR: [
    { category: { contains: "宝可梦" } },
    { category: { contains: "ポケモン" } },
    { name: { contains: "宝可梦" } },
    { name: { contains: "Pokemon" } },
    { name: { contains: "ポケモン" } },
  ],
};

const ONEPIECE_WHERE = {
  OR: [
    { name: { contains: "One Piece" } },
    { name: { contains: "海贼王" } },
    { name: { contains: "ワンピース" } },
  ],
};

const OTHER_WHERE = { NOT: { OR: [POKEMON_WHERE, ONEPIECE_WHERE] } };

async function countForGame(key: (typeof MAIN_GAMES)[number]) {
  if (key === "pokemon") {
    return prisma.product.count({ where: { AND: [ACTIVE_PRODUCT, POKEMON_WHERE] } });
  }
  if (key === "onepiece") {
    return prisma.product.count({ where: { AND: [ACTIVE_PRODUCT, ONEPIECE_WHERE] } });
  }
  return prisma.product.count({ where: { AND: [ACTIVE_PRODUCT, OTHER_WHERE] } });
}

export async function fetchFilterFacets(): Promise<FilterFacets> {
  const [rarityGroups, typeCounts, gameCounts] = await Promise.all([
    prisma.product.groupBy({
      by: ["rarity"],
      where: { ...ACTIVE, rarity: { not: null } },
      _count: { _all: true },
    }),
    Promise.all(
      PRODUCT_TYPES.map(async (key) => ({
        key,
        count: await prisma.product.count({
          where: { AND: [ACTIVE_PRODUCT, typeWhere(key)] },
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
          where: { AND: [ACTIVE_PRODUCT, subGameWhere(key)] },
        });
        return [key, count] as const;
      } catch {
        return [key, 0] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}
