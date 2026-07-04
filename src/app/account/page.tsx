import Link from "next/link";
import { redirect } from "next/navigation";
import { formatJpy } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { logoutMemberAction, requireMember } from "@/app/account/actions";
import { resolveLang, t } from "@/lib/translations";

const STATUS_LABEL: Record<string, string> = {
  pending: "auth_order_pending",
  paid: "auth_order_paid",
  cancelled: "auth_order_cancelled",
};

export default async function AccountPage() {
  const session = await requireMember();
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  const [customer, orders] = await Promise.all([
    prisma.customer.findUnique({ where: { id: session.customerId } }),
    prisma.order.findMany({
      where: {
        OR: [{ customerId: session.customerId }, { customerEmail: session.email }],
        status: { not: "cancelled" },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        items: {
          include: { product: { select: { name: true } } },
        },
      },
    }),
  ]);

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">{T("auth_account_title")}</h1>
          <p className="mt-2 text-sm text-[#6b7280]">{T("auth_account_sub")}</p>
        </div>
        <form action={logoutMemberAction}>
          <button type="submit" className="btn-secondary min-h-10 rounded-full px-5 text-sm">
            {T("auth_logout")}
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6">
        <section className="rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]">
          <h2 className="text-sm font-semibold text-[#111827]">{T("auth_profile")}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-[#9ca3af]">{T("auth_name")}</dt>
              <dd className="text-[#111827]">{customer.name}</dd>
            </div>
            {customer.nameKana && (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#9ca3af]">{T("auth_name_kana")}</dt>
                <dd className="text-[#111827]">{customer.nameKana}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-[#9ca3af]">{T("auth_email")}</dt>
              <dd className="text-[#111827]">{customer.email}</dd>
            </div>
            {customer.phone && (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#9ca3af]">{T("auth_phone")}</dt>
                <dd className="text-[#111827]">{customer.phone}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]">
          <h2 className="text-sm font-semibold text-[#111827]">{T("auth_orders")}</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-[#6b7280]">{T("auth_orders_empty")}</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-[14px] border border-[rgba(17,24,39,0.06)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#6b7280]">{order.id.slice(0, 8)}…</span>
                    <span className="text-xs font-medium text-[#374151]">
                      {T(STATUS_LABEL[order.status] || "auth_order_pending")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#111827]">{formatJpy(order.totalJpy)}</p>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    {order.createdAt.toLocaleString(lang === "en" ? "en-US" : lang === "ja" ? "ja-JP" : "zh-CN", {
                      timeZone: "Asia/Tokyo",
                    })}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-[#6b7280]">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <Link href="/?stock=instock" className="btn-primary mt-6 inline-flex min-h-10 items-center rounded-full px-5 text-sm">
            {T("auth_shop_now")}
          </Link>
        </section>
      </div>
    </div>
  );
}
