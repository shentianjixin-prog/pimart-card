import { prisma } from "@/lib/prisma";
import {
  sortBoxVariants,
  isOpcFormat,
  isGemFormat,
  isSvFormat,
  isSvExtendedFormat,
  isPokemonPairFormat,
  parseGemKey,
  OPC_FORMATS,
  GEM_FORMATS,
  SV_FORMATS,
  type BoxVariantOption,
} from "@/lib/product-box-variant-types";

export type { BoxVariantOption } from "@/lib/product-box-variant-types";
export {
  sortBoxVariants,
  formatVariantTitle,
  firstImage,
  parseGemKey,
} from "@/lib/product-box-variant-types";

type SeriesBlock = {
  era: string;
  prefix: "CS" | "CSM";
  num: string;
  isSlim: boolean;
};

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

/** 解析朱・紫 CSV 键，如 CSV10c */
export function parseCsvSeriesKey(series: string | null | undefined): string | null {
  if (!series) return null;
  const m = series.match(/\b(CSV\d+c)\b/i);
  return m ? m[1].replace(/c$/i, "c").replace(/^csv/i, "CSV") : null;
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

/** 日月/剑盾：肥瘦整盒 + 各自散包/原箱 */
async function findLegacyPokemonVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  const block = parseSeriesBlock(product.series);
  if (!block) return [];

  const language = product.language ?? undefined;
  const options: BoxVariantOption[] = [];
  const seen = new Set<string>();

  function push(p: Parameters<typeof toOption>[0]) {
    if (seen.has(p.id)) return;
    seen.add(p.id);
    options.push(toOption(p));
  }

  push(product);

  const prefix = fatSeriesPattern(block);
  const fatCandidates = await prisma.product.findMany({
    where: {
      status: "上架",
      boxType: { in: ["肥盒", "肥散包", "肥原箱"] },
      ...(language ? { language } : {}),
      series: { startsWith: prefix },
    },
    orderBy: { series: "asc" },
    select: VARIANT_SELECT,
  });

  for (const p of fatCandidates) {
    if (isFatSeriesForBlock(p.series, block)) push(p);
  }

  const slimRows = await prisma.product.findMany({
    where: {
      status: "上架",
      boxType: { in: ["瘦盒", "瘦散包", "瘦原箱"] },
      series: slimSeries(block),
      ...(language ? { language } : {}),
    },
    select: VARIANT_SELECT,
  });
  for (const p of slimRows) push(p);

  if (options.length < 2) return [];
  return sortBoxVariants(options);
}

/** 朱・紫 CSV：同弹肥/瘦 × 整盒/散包/原箱 */
async function findSvVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  const key = parseCsvSeriesKey(product.series);
  if (!key) return [];

  const language = product.language ?? undefined;
  const siblings = await prisma.product.findMany({
    where: {
      status: "上架",
      boxType: { in: [...SV_FORMATS] },
      series: { contains: key },
      ...(language ? { language } : {}),
    },
    select: VARIANT_SELECT,
  });

  const matched = siblings.filter(
    (p) => isSvFormat(p.boxType) && parseCsvSeriesKey(p.series) === key
  );

  if (matched.length < 2) return [];
  return sortBoxVariants(matched.map(toOption));
}

/** 宝石包：同弹 整盒/散包/原箱 */
async function findGemVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  const key = parseGemKey(product.name, product.slug);
  if (!key) return [];

  const language = product.language ?? undefined;
  const siblings = await prisma.product.findMany({
    where: {
      status: "上架",
      boxType: { in: [...GEM_FORMATS] },
      series: "宝石包",
      ...(language ? { language } : {}),
      OR: [{ name: { contains: key } }, { slug: { contains: key } }],
    },
    select: VARIANT_SELECT,
  });

  const matched = siblings.filter(
    (p) => isGemFormat(p.boxType) && parseGemKey(p.name, p.slug) === key
  );

  if (matched.length < 2) return [];
  return sortBoxVariants(matched.map(toOption));
}

async function findPokemonVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  if (parseCsvSeriesKey(product.series) && (isSvFormat(product.boxType) || isPokemonPairFormat(product.boxType))) {
    return findSvVariants(product);
  }
  if (parseSeriesBlock(product.series) && isPokemonPairFormat(product.boxType)) {
    return findLegacyPokemonVariants(product);
  }
  if (isSvFormat(product.boxType) && parseCsvSeriesKey(product.series)) {
    return findSvVariants(product);
  }
  return [];
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
    if (!isOpcFormat(p.boxType)) return false;
    return parseOpcSeriesKey(p.series) === key;
  });

  if (matched.length < 2) return [];
  return sortBoxVariants(matched.map(toOption));
}

/**
 * 查询可切换规格。
 * - 朱・紫 CSV：瘦/肥 × 整盒/散包/原箱
 * - 日月/剑盾：肥瘦整盒 + 散包/原箱
 * - 宝石包：整盒 / 散包 / 原箱
 * - 海贼王 OPC：原盒 / 散包 / 原箱
 */
export async function findBoxVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  if (product.boxType === "宝石包" || (product.series === "宝石包" && isGemFormat(product.boxType))) {
    return findGemVariants(product);
  }
  if (isPokemonPairFormat(product.boxType) || isSvFormat(product.boxType)) {
    return findPokemonVariants(product);
  }
  if (isOpcFormat(product.boxType)) {
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

function csvGroupKey(series: string | null, language: string | null) {
  const key = parseCsvSeriesKey(series);
  if (!key) return null;
  return `${key}::${language ?? ""}`;
}

function gemGroupKey(name: string, slug: string, language: string | null) {
  const key = parseGemKey(name, slug);
  if (!key) return null;
  return `${key}::${language ?? ""}`;
}

/**
 * 列表页批量查规格，避免 N+1。
 */
export async function findBoxVariantsForProducts(
  products: ProductLike[]
): Promise<Map<string, BoxVariantOption[]>> {
  const result = new Map<string, BoxVariantOption[]>();
  if (products.length === 0) return result;

  const opcProducts = products.filter((p) => isOpcFormat(p.boxType) && parseOpcSeriesKey(p.series));
  const gemProducts = products.filter(
    (p) => p.boxType === "宝石包" || (p.series === "宝石包" && isGemFormat(p.boxType))
  );
  const svProducts = products.filter(
    (p) =>
      Boolean(parseCsvSeriesKey(p.series)) &&
      (isSvExtendedFormat(p.boxType) || p.boxType === "肥盒" || p.boxType === "瘦盒")
  );
  const legacyPokemon = products.filter(
    (p) =>
      isPokemonPairFormat(p.boxType) &&
      !parseCsvSeriesKey(p.series) &&
      parseSeriesBlock(p.series)
  );

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
      if (!isOpcFormat(row.boxType)) continue;
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

  if (gemProducts.length > 0) {
    const siblings: SiblingRow[] = await prisma.product.findMany({
      where: {
        status: "上架",
        boxType: { in: [...GEM_FORMATS] },
        series: "宝石包",
      },
      select: VARIANT_SELECT,
    });

    const byGroup = new Map<string, BoxVariantOption[]>();
    for (const row of siblings) {
      if (!isGemFormat(row.boxType)) continue;
      const gk = gemGroupKey(row.name, row.slug, row.language);
      if (!gk) continue;
      const list = byGroup.get(gk) ?? [];
      list.push(toOption(row));
      byGroup.set(gk, list);
    }

    for (const product of gemProducts) {
      const gk = gemGroupKey(product.name, product.slug, product.language);
      if (!gk) continue;
      const sorted = sortBoxVariants(byGroup.get(gk) ?? []);
      if (sorted.length >= 2) result.set(product.id, sorted);
    }
  }

  if (svProducts.length > 0) {
    const keys = [
      ...new Set(
        svProducts
          .map((p) => parseCsvSeriesKey(p.series))
          .filter((k): k is string => Boolean(k))
      ),
    ];

    const siblings: SiblingRow[] =
      keys.length === 0
        ? []
        : await prisma.product.findMany({
            where: {
              status: "上架",
              boxType: { in: [...SV_FORMATS] },
              OR: keys.map((key) => ({ series: { contains: key } })),
            },
            select: VARIANT_SELECT,
          });

    const byGroup = new Map<string, BoxVariantOption[]>();
    for (const row of siblings) {
      if (!isSvFormat(row.boxType)) continue;
      const gk = csvGroupKey(row.series, row.language);
      if (!gk) continue;
      const list = byGroup.get(gk) ?? [];
      list.push(toOption(row));
      byGroup.set(gk, list);
    }

    for (const product of svProducts) {
      const gk = csvGroupKey(product.series, product.language);
      if (!gk) continue;
      const sorted = sortBoxVariants(byGroup.get(gk) ?? []);
      if (sorted.length >= 2) result.set(product.id, sorted);
    }
  }

  await Promise.all(
    legacyPokemon.map(async (product) => {
      const variants = await findLegacyPokemonVariants(product);
      if (variants.length >= 2) result.set(product.id, variants);
    })
  );

  return result;
}
