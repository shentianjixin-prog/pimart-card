import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  cancelled: "已取消",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">订单管理</h1>

      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="text-sm text-gray-400">暂无订单</p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">订单 {order.id}</span>
              <span
                className={
                  order.status === "paid"
                    ? "text-emerald-400"
                    : order.status === "cancelled"
                      ? "text-gray-500"
                      : "text-amber-400"
                }
              >
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {order.createdAt.toLocaleString("zh-CN")} ·{" "}
              {order.customerName || order.customerEmail || "未登记客户信息"}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatJpy(item.priceJpy * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-2 text-sm font-semibold text-white">
              <span>合计</span>
              <span className="text-cyan-300">{formatJpy(order.totalJpy)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
