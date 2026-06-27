import { prisma } from "@/lib/prisma";
import {
  type FilterFacets,
  GAMES,
  PRODUCT_TYPES,
  ACTIVE_PRODUCT,
  gameWhere,
  typeWhere,
} from "@/lib/product-filters";

const ACTIVE = { status: "上架" as const };

export async function fetchFilterFacets(): Promise<FilterFacets> {
  const [langGroups, seriesGroups, rarityGroups, typeCounts, gameCounts] =
    await Promise.all([
      prisma.product.groupBy({
        by: ["language"],
        where: { ...ACTIVE, language: { not: null } },
        _count: { _all: true },
      }),
      prisma.product.groupBy({
        by: ["series"],
        where: { ...ACTIVE, series: { not: null } },
        _count: { _all: true },
      }),
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
        GAMES.map(async (key) => ({
          key,
          count: await prisma.product.count({
            where: { AND: [ACTIVE_PRODUCT, gameWhere(key)] },
          }),
        }))
      ),
    ]);

  return {
    languages: langGroups
      .filter((g) => g.language)
      .map((g) => ({ value: g.language!, count: g._count._all }))
      .sort((a, b) => b.count - a.count),
    series: seriesGroups
      .filter((g) => g.series)
      .map((g) => ({ value: g.series!, count: g._count._all }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    rarities: rarityGroups
      .filter((g) => g.rarity)
      .map((g) => ({ value: g.rarity!, count: g._count._all }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    types: typeCounts,
    games: gameCounts,
  };
}
