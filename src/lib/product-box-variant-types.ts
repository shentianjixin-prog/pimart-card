export type BoxVariantOption = {
  id: string;
  slug: string;
  boxType: string;
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
};

/** 海贼王 OPC */
export const OPC_FORMATS = ["原盒", "散包", "原箱"] as const;

/** 朱・紫 CSV 全规格（含整盒肥瘦） */
export const SV_FORMATS = ["瘦盒", "肥盒", "瘦散包", "肥散包", "瘦原箱", "肥原箱"] as const;

/** 仅朱紫扩展规格（不含日月/剑盾共用的肥盒/瘦盒名） */
export const SV_EXTENDED_FORMATS = ["瘦散包", "肥散包", "瘦原箱", "肥原箱"] as const;

const OPC_FORMAT_SET = new Set<string>(OPC_FORMATS);
const SV_FORMAT_SET = new Set<string>(SV_FORMATS);
const SV_EXTENDED_SET = new Set<string>(SV_EXTENDED_FORMATS);

function formatRank(boxType: string) {
  const sv = SV_FORMATS.indexOf(boxType as (typeof SV_FORMATS)[number]);
  if (sv >= 0) return sv;
  if (boxType === "肥盒") return 0;
  if (boxType === "瘦盒") return 1;
  const opc = OPC_FORMATS.indexOf(boxType as (typeof OPC_FORMATS)[number]);
  return opc >= 0 ? 10 + opc : 99;
}

export function sortBoxVariants(variants: BoxVariantOption[]) {
  return [...variants].sort((a, b) => formatRank(a.boxType) - formatRank(b.boxType));
}

export function isOpcFormat(boxType: string) {
  return OPC_FORMAT_SET.has(boxType);
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
    .replace(/\s*(肥盒|瘦盒|肥散包|瘦散包|肥原箱|瘦原箱)\s*/g, " ")
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
  };

  const hit = map[boxType];
  if (hit) {
    const mid = [code, title].filter(Boolean).join("");
    return `(${hit.tag}) ${mid}补充包 (${hit.unit})`;
  }

  return name;
}

export function firstImage(images: string) {
  return images.split(",").map((s) => s.trim()).find(Boolean) || "/products/placeholder.png";
}
