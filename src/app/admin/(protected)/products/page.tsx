import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { deleteProductAction } from "../../actions";
import { QuickStockEdit } from "@/components/admin/QuickStockEdit";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">商品管理</h1>
        <Link href="/admin/products/new" className="btn-primary">
          + 新增商品
        </Link>
      </div>

      <div className="surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="px-4 py-2">名称</th>
              <th className="px-4 py-2">卡号</th>
              <th className="px-4 py-2">稀有度</th>
              <th className="px-4 py-2">语言</th>
              <th className="px-4 py-2">状态</th>
              <th className="px-4 py-2">价格</th>
              <th className="px-4 py-2">库存</th>
              <th className="px-4 py-2">订单数</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-gray-300">
            {products.map((p) => {
              const hasOrders = p._count.orderItems > 0;
              const isArchived = p.status === "下架";
              return (
                <tr key={p.id} className={isArchived ? "opacity-60" : undefined}>
                  <td className="px-4 py-2 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-2">{p.cardNumber || "—"}</td>
                  <td className="px-4 py-2">{p.rarity || "—"}</td>
                  <td className="px-4 py-2">{p.language || "—"}</td>
                  <td className="px-4 py-2">
                    {isArchived ? (
                      <span className="text-gray-400">已下架</span>
                    ) : p.isPreorder ? (
                      <span className="text-orange-400">预售</span>
                    ) : (
                      <span className="text-cyan-400">{p.status || "上架"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-cyan-300">{formatJpy(p.priceJpy)}</td>
                  <td className="px-4 py-2">
                    <QuickStockEdit productId={p.id} initialStock={p.stock} />
                  </td>
                  <td className="px-4 py-2">{p._count.orderItems}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="mr-3 text-cyan-300 hover:text-cyan-200"
                    >
                      编辑
                    </Link>
                    {!isArchived && (
                      <form action={deleteProductAction} className="inline">
                        <input type="hidden" name="productId" value={p.id} />
                        <button
                          type="submit"
                          className="text-red-400 hover:text-red-300"
                          title={
                            hasOrders
                              ? "该商品有订单历史，将执行下架归档"
                              : "无订单历史，将永久删除"
                          }
                        >
                          {hasOrders ? "下架" : "删除"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
