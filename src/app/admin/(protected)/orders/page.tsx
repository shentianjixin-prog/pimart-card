import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  cancelled: "已取消",
  shipping_review: "地址待复核",
};

function formatShippingAddress(raw: string | null) {
  if (!raw) return "Stripe 付款完成后显示完整收货地址";
  try {
    const data = JSON.parse(raw) as {
      name?: string;
      phone?: string | null;
      address?: {
        postal_code?: string | null;
        state?: string | null;
        city?: string | null;
        line1?: string | null;
        line2?: string | null;
      };
    };
    const address = data.address;
    return [
      data.name,
      data.phone,
      address?.postal_code ? `〒${address.postal_code}` : null,
      address?.state,
      address?.city,
      address?.line1,
      address?.line2,
    ].filter(Boolean).join(" ") || "收货地址未记录";
  } catch {
    return "收货地址数据无法解析";
  }
}

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
                    : order.status === "shipping_review"
                      ? "text-orange-400"
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
            <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-gray-300">
              <p>配送地区：{order.shippingPrefecture || "未记录"}</p>
              <p className="mt-1">国内运费：{formatJpy(order.shippingFeeJpy)}</p>
              <p className="mt-1 leading-relaxed">收货信息：{formatShippingAddress(order.shippingAddressJson)}</p>
            </div>
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
