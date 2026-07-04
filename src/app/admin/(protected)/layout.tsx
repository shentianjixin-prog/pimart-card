import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { logoutAction } from "../actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="surface w-48 shrink-0 space-y-1 p-3 text-sm">
        <p className="mb-3 px-3 text-xs text-gray-500">管理员：{session.username}</p>
        <Link href="/admin" className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white">
          概览
        </Link>
        <Link
          href="/admin/products"
          className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          商品管理
        </Link>
        <Link
          href="/admin/orders"
          className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          订单管理
        </Link>
        <Link
          href="/admin/buyback"
          className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          买取申请
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-4 block w-full rounded-lg px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
          >
            退出登录
          </button>
        </form>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
