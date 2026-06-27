import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { QuickStockEdit } from "@/components/admin/QuickStockEdit";

const STATUS_TABS = [
  { label: "全部", value: "" },
  { label: "上架", value: "上架" },
  { label: "下架", value: "下架" },
  { label: "草稿", value: "草稿" },
];

const STATUS_COLOR: Record<string, string> = {
  上架: "text-emerald-400",
  下架: "text-gray-400",
  草稿: "text-amber-400",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const statusFilter = sp.status ?? "";

  const products = await prisma.product.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
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

      {/* 状态 tab */}
      <div className="mb-4 flex gap-1">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/products?status=${tab.value}` : "/admin/products"}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <span className="ml-2 self-center text-sm text-gray-500">
          {products.length} 件
        </span>
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
              const isArchived = p.status === "下架";
              const isDraft = p.status === "草稿";
              return (
                <tr
                  key={p.id}
                  className={isArchived || isDraft ? "opacity-60" : undefined}
                >
                  <td className="px-4 py-2 font-medium text-white">
                    {p.name}
                    {p.isPreorder && (
                      <span className="ml-2 rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-400">
                        预售
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{p.cardNumber || "—"}</td>
                  <td className="px-4 py-2">{p.rarity || "—"}</td>
                  <td className="px-4 py-2">{p.language || "—"}</td>
                  <td className={`px-4 py-2 ${STATUS_COLOR[p.status] ?? "text-gray-300"}`}>
                    {p.status || "上架"}
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
                      <DeleteProductButton
                        productId={p.id}
                        productName={p.name}
                        orderCount={p._count.orderItems}
                      />
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
