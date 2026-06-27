import Link from "next/link";

export const metadata = {
  title: "发货说明 | PIMART CARD",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="gradient-text mb-6 text-2xl font-bold">发货说明</h1>
      <div className="surface space-y-6 p-6 text-sm text-gray-300">

        <section>
          <h2 className="mb-3 font-semibold text-white">📦 两种发货模式</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="mb-1 font-semibold text-cyan-400">日本仓直发</p>
              <p className="text-gray-400">下单后 <span className="text-white font-medium">3 个工作日</span>内发货</p>
              <p className="mt-1 text-xs text-gray-500">适用商品页面标注「日本仓」的商品</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="mb-1 font-semibold text-cyan-400">中国海外直邮</p>
              <p className="text-gray-400">下单后 <span className="text-white font-medium">7〜14 个工作日</span>到货</p>
              <p className="mt-1 text-xs text-gray-500">适用商品页面标注「直邮」的商品，可能产生关税（买家承担）</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-white">发货通知</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-gray-400">
            <li>订单支付成功后，我们会尽快安排打包</li>
            <li>发货后通过邮件发送物流追踪信息</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-white">包装说明</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-gray-400">
            <li>原盒商品使用专用纸箱及气泡缓冲材料包装</li>
            <li>周边商品采用防潮包装，降低运输途中受损风险</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-white">注意事项</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-gray-400">
            <li>节假日、恶劣天气或通关延误可能影响到货时间</li>
            <li>海外直邮如产生关税，费用由买家承担</li>
            <li>如有疑问请联系：<a href="mailto:shentianjixin@gmail.com" className="text-cyan-400 hover:text-cyan-300">shentianjixin@gmail.com</a></li>
          </ul>
        </section>

        <p>
          <Link href="/" className="font-medium text-cyan-300 hover:text-cyan-200">
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
