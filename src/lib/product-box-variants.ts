import { prisma } from "@/lib/prisma";

export type BoxVariantOption = {
  slug: string;
  boxType: "肥盒" | "瘦盒";
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
};

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

function slimSeries(block: SeriesBlock) {
  return `${block.era} ${block.prefix}${block.num}.5`;
}

function fatSeriesPattern(block: SeriesBlock) {
  // Prisma SQLite：用 startsWith + 字母后缀在应用层过滤
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

/**
 * 查询可切换的肥/瘦规格。
 * 仅当当前为肥盒或瘦盒，且能按 series 编号配对到另一规格时返回选项（含当前商品）。
 */
export async function findBoxVariants(product: ProductLike): Promise<BoxVariantOption[]> {
  if (product.boxType !== "肥盒" && product.boxType !== "瘦盒") return [];

  const block = parseSeriesBlock(product.series);
  if (!block) return [];

  const language = product.language ?? undefined;
  const current: BoxVariantOption = {
    slug: product.slug,
    boxType: product.boxType,
    name: product.name,
    priceJpy: product.priceJpy,
    stock: product.stock,
    images: product.images,
  };

  if (block.isSlim) {
    // 瘦盒 → 找同区块肥盒（可能多条 a/b/c）
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
      select: {
        slug: true,
        boxType: true,
        name: true,
        priceJpy: true,
        stock: true,
        images: true,
        series: true,
      },
    });

    const fats = candidates.filter((p) => isFatSeriesForBlock(p.series, block));
    if (fats.length === 0) return [];

    // 规格区只展示「肥盒 / 瘦盒」两格：肥盒取第一条（优先 b，否则首条）
    const preferred =
      fats.find((p) => /b$/i.test(p.series ?? "")) ?? fats[0];

    return [
      {
        slug: preferred.slug,
        boxType: "肥盒",
        name: preferred.name,
        priceJpy: preferred.priceJpy,
        stock: preferred.stock,
        images: preferred.images,
      },
      current,
    ];
  }

  // 肥盒 → 找同区块瘦盒
  const slim = await prisma.product.findFirst({
    where: {
      status: "上架",
      boxType: "瘦盒",
      series: slimSeries(block),
      ...(language ? { language } : {}),
      NOT: { id: product.id },
    },
    select: {
      slug: true,
      boxType: true,
      name: true,
      priceJpy: true,
      stock: true,
      images: true,
    },
  });

  if (!slim) return [];

  return [
    current,
    {
      slug: slim.slug,
      boxType: "瘦盒",
      name: slim.name,
      priceJpy: slim.priceJpy,
      stock: slim.stock,
      images: slim.images,
    },
  ];
}
