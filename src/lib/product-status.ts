import type { Prisma } from "@/generated/prisma/client";

/** 前台仅展示未下架商品 */
export const PUBLIC_PRODUCT_WHERE: Prisma.ProductWhereInput = {
  status: { not: "下架" },
};

export function isProductArchived(status: string | null | undefined) {
  return status === "下架";
}
