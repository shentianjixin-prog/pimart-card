import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBuybackPage() {
  const rows = await prisma.buybackRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">买取申请</h1>
        <Link href="/buyback" className="text-sm text-cyan-400 hover:text-cyan-300">
          打开前台表单 →
        </Link>
      </div>
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-4 py-2">受付番号</th>
              <th className="px-4 py-2">姓名</th>
              <th className="px-4 py-2">邮箱</th>
              <th className="px-4 py-2">状态</th>
              <th className="px-4 py-2">提交时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  暂无买取申请
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 text-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">{row.orderNo}</td>
                  <td className="px-4 py-2">
                    <div>{row.name}</div>
                    <div className="text-xs text-gray-500">{row.nameKana}</div>
                  </td>
                  <td className="px-4 py-2">{row.email}</td>
                  <td className="px-4 py-2">{row.status}</td>
                  <td className="px-4 py-2 text-xs text-gray-400">
                    {row.createdAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
