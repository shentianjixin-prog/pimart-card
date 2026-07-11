export type BoxVariantOption = {
  id: string;
  slug: string;
  boxType: string;
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
};

/** 海贼王 OPC / 宝石包等同系列三规格 */
export const OPC_FORMATS = ["原盒", "散包", "原箱"] as const;

/** 宝石包：整盒用 boxType「宝石包」 */
export const GEM_FORMATS = ["宝石包", "散包", "原箱"] as const;

/** 朱・紫 CSV 全规格（含整盒肥瘦） */
export const SV_FORMATS = ["瘦盒", "肥盒", "瘦散包", "肥散包", "瘦原箱", "肥原箱"] as const;

/** 仅扩展规格（日月/剑盾/朱紫散包与原箱） */
export const SV_EXTENDED_FORMATS = ["瘦散包", "肥散包", "瘦原箱", "肥原箱"] as const;

const OPC_FORMAT_SET = new Set<string>(OPC_FORMATS);
const GEM_FORMAT_SET = new Set<string>(GEM_FORMATS);
const SV_FORMAT_SET = new Set<string>(SV_FORMATS);
const SV_EXTENDED_SET = new Set<string>(SV_EXTENDED_FORMATS);

function formatRank(boxType: string) {
  const sv = SV_FORMATS.indexOf(boxType as (typeof SV_FORMATS)[number]);
  if (sv >= 0) return sv;
  if (boxType === "肥盒") return 0;
  if (boxType === "瘦盒") return 1;
  if (boxType === "宝石包") return 10;
  const opc = OPC_FORMATS.indexOf(boxType as (typeof OPC_FORMATS)[number]);
  return opc >= 0 ? 10 + opc : 99;
}

export function sortBoxVariants(variants: BoxVariantOption[]) {
  return [...variants].sort((a, b) => formatRank(a.boxType) - formatRank(b.boxType));
}

export function isOpcFormat(boxType: string) {
  return OPC_FORMAT_SET.has(boxType);
}

export function isGemFormat(boxType: string) {
  return GEM_FORMAT_SET.has(boxType);
}

export function isSvFormat(boxType: string) {
  return SV_FORMAT_SET.has(boxType);
}

export function isSvExtendedFormat(boxType: string) {
  return SV_EXTENDED_SET.has(boxType);
}

export function isPokemonPairFormat(boxType: string) {
  return boxType === "肥盒" || boxType === "瘦盒" || isSvExtendedFormat(boxType);
}

/** 详情/列表展示用：对齐集换社「(瘦包) … (整盒)」文案 */
export function formatVariantTitle(boxType: string, name: string, series: string | null | undefined) {
  const code = (series || "").match(/CSV\d+c/i)?.[0]?.toUpperCase() || "";
  const title = name
    .replace(/^补充包\s*/, "")
    .replace(/\s*(肥盒|瘦盒|肥散包|瘦散包|肥原箱|瘦原箱|宝石包|散包|原箱|原盒)\s*/g, " ")
    .replace(/\s*BOX.*$/i, "")
    .replace(/（简中）$/, "")
    .replace(/\s+/g, "")
    .trim();

  const map: Record<string, { tag: string; unit: string }> = {
    瘦盒: { tag: "瘦包", unit: "整盒" },
    肥盒: { tag: "肥包", unit: "整盒" },
    瘦散包: { tag: "瘦包", unit: "散包" },
    肥散包: { tag: "肥包", unit: "散包" },
    瘦原箱: { tag: "瘦包", unit: "1箱" },
    肥原箱: { tag: "肥包", unit: "1箱" },
    宝石包: { tag: "宝石包", unit: "整盒" },
    散包: { tag: "散包", unit: "散包" },
    原箱: { tag: "原箱", unit: "1箱" },
    原盒: { tag: "原盒", unit: "整盒" },
  };

  const hit = map[boxType];
  if (hit && code) {
    const mid = [code, title].filter(Boolean).join("");
    return `(${hit.tag}) ${mid}补充包 (${hit.unit})`;
  }
  if (hit && (boxType === "宝石包" || boxType === "散包" || boxType === "原箱")) {
    return `(${hit.tag}) ${title || name} (${hit.unit})`;
  }
  if (hit && code === "" && (boxType.includes("盒") || boxType.includes("包") || boxType.includes("箱"))) {
    return `(${hit.tag}) ${title || name} (${hit.unit})`;
  }

  return name;
}

export function firstImage(images: string) {
  return images.split(",").map((s) => s.trim()).find(Boolean) || "/products/placeholder.png";
}

/** 宝石包第 N 弹分组键 */
export function parseGemKey(name: string | null | undefined, slug?: string | null): string | null {
  const hay = `${name || ""} ${slug || ""}`;
  const m = hay.match(/宝石包第([一二三四五六七八九十\d]+)弹/);
  return m ? `宝石包第${m[1]}弹` : null;
}
