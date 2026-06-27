import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="gradient-text mb-6 text-2xl font-bold">联系方式</h1>
      <div className="surface space-y-4 p-6 text-sm text-gray-300">
        <p>如有商品咨询、订单问题或售后需求，欢迎通过以下方式联系我们：</p>
        <ul className="list-disc space-y-2 pl-5 text-gray-400">
          <li>邮箱：<a href="mailto:shentianjixin@gmail.com" className="text-cyan-400 hover:text-cyan-300">shentianjixin@gmail.com</a></li>
          <li>工作时间：周一至周五 10:00 - 18:00（日本时间）</li>
          <li>我们会在 1-2 个工作日内回复您的邮件</li>
        </ul>
        <p className="pt-2">
          <Link href="/" className="font-medium text-cyan-300 hover:text-cyan-200">
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
