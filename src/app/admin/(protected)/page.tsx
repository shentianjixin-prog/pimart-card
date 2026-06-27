import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, paidOrders, preorderCount, inStockCount, lowStockCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: "paid" } }),
      prisma.product.count({ where: { isPreorder: true } }),
      prisma.product.count({ where: { isPreorder: false, stock: { gt: 0 } } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 3 } } }),
    ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalJpy, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">概览</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="surface p-5">
          <p className="text-sm text-gray-500">商品总数</p>
          <p className="mt-1 text-2xl font-bold text-white">{productCount}</p>
          <p className="mt-2 text-xs text-gray-500">
            现货 {inStockCount} · 预售 {preorderCount}
          </p>
          <Link href="/admin/products" className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200">
            管理商品
          </Link>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-gray-500">订单总数</p>
          <p className="mt-1 text-2xl font-bold text-white">{orderCount}</p>
          <Link href="/admin/orders" className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200">
            查看订单
          </Link>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-gray-500">已支付总额</p>
          <p className="gradient-text mt-1 text-2xl font-bold">{formatJpy(totalRevenue)}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-gray-500">低库存商品</p>
          <p className="mt-1 text-2xl font-bold text-orange-300">{lowStockCount}</p>
          <p className="mt-2 text-xs text-gray-500">库存 ≤ 3 件</p>
        </div>
      </div>
    </div>
  );
}
