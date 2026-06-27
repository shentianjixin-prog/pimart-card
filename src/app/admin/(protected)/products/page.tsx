import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { deleteProductAction } from "../../actions";
import { QuickStockEdit } from "@/components/admin/QuickStockEdit";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
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
              <th className="px-4 py-2">分类</th>
              <th className="px-4 py-2">系列</th>
              <th className="px-4 py-2">类型</th>
              <th className="px-4 py-2">价格</th>
              <th className="px-4 py-2">库存</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-gray-300">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 font-medium text-white">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.series || "—"}</td>
                <td className="px-4 py-2">
                  {p.isPreorder ? (
                    <span className="text-orange-400">预售</span>
                  ) : (
                    <span className="text-cyan-400">现货</span>
                  )}
                </td>
                <td className="px-4 py-2 text-cyan-300">{formatJpy(p.priceJpy)}</td>
                <td className="px-4 py-2">
                  <QuickStockEdit productId={p.id} initialStock={p.stock} />
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="mr-3 text-cyan-300 hover:text-cyan-200"
                  >
                    编辑
                  </Link>
                  <form action={deleteProductAction} className="inline">
                    <input type="hidden" name="productId" value={p.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300">
                      删除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
