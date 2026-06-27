"use client";

import { deleteProductAction } from "@/app/admin/actions";

type Props = {
  productId: string;
  productName: string;
  orderCount: number;
};

export function DeleteProductButton({ productId, productName, orderCount }: Props) {
  const hasOrders = orderCount > 0;
  const label = hasOrders ? "下架" : "删除";

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const msg = hasOrders
      ? `「${productName}」已有 ${orderCount} 条订单记录，将下架归档，不会删除历史订单。确认继续？`
      : `确定永久删除「${productName}」？此操作不可恢复。`;
    if (!confirm(msg)) e.preventDefault();
  }

  return (
    <form action={deleteProductAction} className="inline">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="text-red-400 hover:text-red-300"
        title={
          hasOrders
            ? "该商品有订单历史，将执行下架归档（不会删除订单记录）"
            : "无订单历史，将永久删除该商品"
        }
        onClick={handleClick}
      >
        {label}
      </button>
    </form>
  );
}
