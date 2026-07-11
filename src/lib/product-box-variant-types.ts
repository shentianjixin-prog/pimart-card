export type BoxVariantOption = {
  id: string;
  slug: string;
  boxType: string;
  name: string;
  priceJpy: number;
  stock: number;
  images: string;
};

const OPC_FORMATS = ["原盒", "散包", "原箱"] as const;

function formatRank(boxType: string) {
  if (boxType === "肥盒") return 0;
  if (boxType === "瘦盒") return 1;
  const opc = OPC_FORMATS.indexOf(boxType as (typeof OPC_FORMATS)[number]);
  return opc >= 0 ? opc : 99;
}

export function sortBoxVariants(variants: BoxVariantOption[]) {
  return [...variants].sort((a, b) => formatRank(a.boxType) - formatRank(b.boxType));
}
