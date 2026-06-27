import Link from "next/link";

const SECTIONS = [
  {
    title: "购买流程",
    items: [
      "在首页浏览商品，或用左侧筛选按分类、现货/预售、价格区间查找",
      "进入商品详情页，确认系列、价格与发货说明后选择数量",
      "点击「加入购物车」或「立即购买」，在购物车页面确认后去结算",
      "跳转 Stripe 安全支付页面完成付款，支付成功后会返回订单完成页",
    ],
  },
  {
    title: "现货与预售",
    items: [
      "现货商品：下单后 5-7 个工作日内安排发货",
      "预售商品：将在预计发货日或到货后优先安排发货，详情页会标注预售信息",
      "预售商品同样支持正常下单支付，发货时间以商品页说明为准",
    ],
  },
  {
    title: "支付方式",
    items: [
      "目前通过 Stripe 提供在线信用卡支付，支持 Visa / Mastercard / JCB 等",
      "支付过程全程由 Stripe 加密处理，本站不会接触或保存你的卡号信息",
    ],
  },
  {
    title: "配送说明",
    items: [
      "原盒商品使用专用纸箱及缓冲材料包装",
      "火影忍者周边采用防潮包装，降低运输途中受损风险",
      "发货后我们将通过邮件发送物流信息",
    ],
  },
  {
    title: "售后与退换货",
    items: [
      "如收到商品与描述不符或运输途中损坏，请在收货后 7 天内联系我们处理",
      "原盒及 sealed 商品一经拆封，原则上不支持因个人原因退换",
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="gradient-text mb-8 text-2xl font-bold">购物指南</h1>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              {section.title}
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-400">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="surface mt-12 p-5 text-sm text-gray-400">
        还有其他疑问？欢迎查看
        <Link href="/contact" className="mx-1 font-medium text-cyan-300 hover:text-cyan-200">
          联系方式
        </Link>
        或
        <Link href="/shipping" className="mx-1 font-medium text-cyan-300 hover:text-cyan-200">
          发货说明
        </Link>
        ，也可以
        <Link href="/" className="mx-1 font-medium text-cyan-300 hover:text-cyan-200">
          返回首页
        </Link>
        继续选购。
      </div>
    </div>
  );
}
