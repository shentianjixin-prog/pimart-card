import { prisma } from "@/lib/prisma";
import {
  sortBoxVariants,
  type BoxVariantOption,
} from "@/lib/product-box-variant-types";

export type { BoxVariantOption } from "@/lib/product-box-variant-types";
export { sortBoxVariants } from "@/lib/product-box-variant-types";

type SeriesBlock = {
  era: string;
  prefix: "CS" | "CSM";
  num: string;
  isSlim: boolean;
};

const POKEMON_FORMATS = new Set(["肥盒", "瘦盒"]);
const OPC_FORMATS = ["原盒", "散包", "原箱"] as const;
const OPC_FORMAT_SET = new Set<string>(OPC_FORMATS);

/** 从 series 解析剑&盾 / 太阳&月亮 的肥瘦区块号 */
export function parseSeriesBlock(series: string | null | undefined): SeriesBlock | null {
  if (!series) return null;

  const slim = series.match(/^(剑&盾|太阳&月亮)\s+(CSM?)(\d+)\.5$/);
  if (slim) {
    return {
      era: slim[1],
      prefix: slim[2] as "CS" | "CSM",
      num: slim[3],
      isSlim: true,
    };
  }

  const fat = series.match(/^(剑&盾|太阳&月亮)\s+(CSM?)(\d+)[a-c]$/i);
  if (fat) {
    return {
      era: fat[1],
      prefix: fat[2] as "CS" | "CSM",
      num: fat[3],
      isSlim: false,
    };
  }

  return null;
}

/** 解析海贼王 OPC 系列键，如 OPC-01 */
export function parseOpcSeriesKey(series: string | null | undefined): string | null {
  if (!series) return null;
  const m = series.match(/^(OPC-\d+)\b/i);
  return m ? m[1].toUpperCase() : null;
}

function slimSeries(block: SeriesBlock) {
  return `${block.era} ${block.prefix}${block.num}.5`;
}

function fatSeriesPattern(block: SeriesBlock) {
  return `${block.era} ${block.prefix}${block.num}`;
}

function isFatSeriesForBlock(series: string | null, block: SeriesBlock) {
  if (!series) return false;
  return new RegExp(
    `^${escapeRegExp(block.era)}\\s+${escapeRegExp(block.prefix)}${block.num}[a-c]$`,
    "i"
  ).test(series);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type ProductLike = {
  id: string;
  slug: string;
  name: string;
  boxType: string;
  series: string | null;
  language: string | null;
  priceJpy: number;
  stock: number;
  images: string;
  status: string;
};

const VARIANT_SELECT = {
  id: true,
  slug: true,
  boxType: true,
  name: true,
  priceJpy: true,
  stock: true,
  images: true,
  series: true,
  language: true,
} as const;

function toOption(p: {
  id: string;
  slug: string;
  boxType: string;
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
}): BoxVariantOption {
  return {
    id: p.id,
    slug: p.slug,
    boxType: p.boxType,
    name: p.name,
    priceJpy: p.priceJpy,
    stock: p.stock,
    images: p.images,
  };
}

async function findPokemonVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  const block = parseSeriesBlock(product.series);
  if (!block) return [];

  const language = product.language ?? undefined;
  const current = toOption(product);

  if (block.isSlim) {
    const prefix = fatSeriesPattern(block);
    const candidates = await prisma.product.findMany({
      where: {
        status: "上架",
        boxType: "肥盒",
        ...(language ? { language } : {}),
        series: { startsWith: prefix },
        NOT: { id: product.id },
      },
      orderBy: { series: "asc" },
      select: VARIANT_SELECT,
    });

    const fats = candidates.filter((p) => isFatSeriesForBlock(p.series, block));
    if (fats.length === 0) return [];

    const preferred = fats.find((p) => /b$/i.test(p.series ?? "")) ?? fats[0];
    return sortBoxVariants([toOption(preferred), current]);
  }

  const slim = await prisma.product.findFirst({
    where: {
      status: "上架",
      boxType: "瘦盒",
      series: slimSeries(block),
      ...(language ? { language } : {}),
      NOT: { id: product.id },
    },
    select: VARIANT_SELECT,
  });

  if (!slim) return [];
  return sortBoxVariants([current, toOption(slim)]);
}

async function findOpcVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  const key = parseOpcSeriesKey(product.series);
  if (!key) return [];

  const language = product.language ?? undefined;
  const siblings = await prisma.product.findMany({
    where: {
      status: "上架",
      boxType: { in: [...OPC_FORMATS] },
      series: { startsWith: key },
      ...(language ? { language } : {}),
    },
    select: VARIANT_SELECT,
  });

  const matched = siblings.filter((p) => {
    if (!OPC_FORMAT_SET.has(p.boxType)) return false;
    return parseOpcSeriesKey(p.series) === key;
  });

  if (matched.length < 2) return [];
  return sortBoxVariants(matched.map(toOption));
}

/**
 * 查询可切换规格。
 * - 宝可梦：肥盒 / 瘦盒（按 series 区块配对）
 * - 海贼王 OPC：原盒 / 散包 / 原箱（同 OPC 编号）
 * 无配对时返回空数组，详情页不渲染规格区。
 */
export async function findBoxVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  if (POKEMON_FORMATS.has(product.boxType)) {
    return findPokemonVariants(product);
  }
  if (OPC_FORMAT_SET.has(product.boxType)) {
    return findOpcVariants(product);
  }
  return [];
}

type SiblingRow = {
  id: string;
  slug: string;
  boxType: string;
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
  series: string | null;
  language: string | null;
};

function opcGroupKey(series: string | null, language: string | null) {
  const key = parseOpcSeriesKey(series);
  if (!key) return null;
  return `${key}::${language ?? ""}`;
}

/**
 * 列表页批量查规格，避免 N+1。
 * 返回 productId → 可切换规格（含自身；少于 2 个则不入 map）。
 */
export async function findBoxVariantsForProducts(
  products: ProductLike[]
): Promise<Map<string, BoxVariantOption[]>> {
  const result = new Map<string, BoxVariantOption[]>();
  if (products.length === 0) return result;

  const opcProducts = products.filter((p) => OPC_FORMAT_SET.has(p.boxType));
  const pokemonProducts = products.filter((p) => POKEMON_FORMATS.has(p.boxType));

  if (opcProducts.length > 0) {
    const prefixes = [
      ...new Set(
        opcProducts
          .map((p) => parseOpcSeriesKey(p.series))
          .filter((k): k is string => Boolean(k))
      ),
    ];

    const siblings: SiblingRow[] =
      prefixes.length === 0
        ? []
        : await prisma.product.findMany({
            where: {
              status: "上架",
              boxType: { in: [...OPC_FORMATS] },
              OR: prefixes.map((prefix) => ({ series: { startsWith: prefix } })),
            },
            select: VARIANT_SELECT,
          });

    const byGroup = new Map<string, BoxVariantOption[]>();
    for (const row of siblings) {
      if (!OPC_FORMAT_SET.has(row.boxType)) continue;
      const gk = opcGroupKey(row.series, row.language);
      if (!gk) continue;
      const list = byGroup.get(gk) ?? [];
      list.push(toOption(row));
      byGroup.set(gk, list);
    }

    for (const product of opcProducts) {
      const gk = opcGroupKey(product.series, product.language);
      if (!gk) continue;
      const sorted = sortBoxVariants(byGroup.get(gk) ?? []);
      if (sorted.length >= 2) result.set(product.id, sorted);
    }
  }

  // 宝可梦肥瘦：数量少，逐个配对即可（首页通常 ≤8）
  await Promise.all(
    pokemonProducts.map(async (product) => {
      const variants = await findPokemonVariants(product);
      if (variants.length >= 2) result.set(product.id, variants);
    })
  );

  return result;
}
