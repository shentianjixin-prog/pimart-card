import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">发货说明</h1>
      <div className="surface space-y-6 p-6 text-sm text-[#374151]">
        <section>
          <h2 className="mb-2 font-semibold text-[#111827]">发货时效</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-[#6b7280]">
            <li>现货商品：下单后 5-7 个工作日内发货</li>
            <li>预售商品：将在预计发货日或商品到货后尽快安排发货</li>
            <li>具体发货日以商品详情页标注为准</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-[#111827]">发货通知</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-[#6b7280]">
            <li>订单支付成功后，我们会尽快为您安排打包</li>
            <li>发货后我们将通过邮件发送物流信息</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-[#111827]">包装说明</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-[#6b7280]">
            <li>原盒商品使用专用纸箱及缓冲材料包装</li>
            <li>周边商品采用防潮包装，降低运输途中受损风险</li>
          </ul>
        </section>
        <p>
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
