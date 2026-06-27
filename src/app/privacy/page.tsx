export const metadata = {
  title: "隐私政策 | PIMART CARD",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-white">隐私政策</h1>
      <p className="mb-1 text-sm text-gray-500">プライバシーポリシー / Privacy Policy</p>
      <p className="mb-6 text-sm text-gray-400">最后更新：2026年6月27日</p>
      <p className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
        本站根据日本<strong className="text-gray-300">个人情报保护法（個人情報の保護に関する法律）</strong>
        对您的个人信息进行妥善管理。
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-gray-300">
        <section>
          <h2 className="mb-3 text-base font-semibold text-white">1. 信息收集</h2>
          <p>
            PIMART CARD（以下简称"本站"）在您完成购买时收集以下信息：姓名、电子邮件地址、
            收货地址及支付相关信息。支付信息由 Stripe 安全处理，本站不存储您的完整支付卡号。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">2. 信息使用目的</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>处理订单及安排发货</li>
            <li>发送订单确认及物流通知邮件</li>
            <li>改善网站服务与用户体验</li>
            <li>遵守适用的法律法规</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">3. 信息共享</h2>
          <p>
            本站不会出售、出租或以其他方式向无关第三方披露您的个人信息，但以下情况除外：
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>向物流服务商（如 EMS、佐川急便等）提供必要的收件信息以完成配送</li>
            <li>向支付处理商（Stripe）传递订单金额等必要数据</li>
            <li>法律法规要求披露时</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">4. Cookie 与跟踪技术</h2>
          <p>
            本站使用 Cookie 维持购物车状态及登录会话。您可在浏览器设置中禁用 Cookie，
            但这可能影响部分功能的正常使用。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">5. 数据安全</h2>
          <p>
            本站采用 HTTPS 加密传输，敏感数据通过行业标准方式加密存储。尽管如此，
            互联网上的数据传输无法保证绝对安全，请您知悉。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">6. 数据保留</h2>
          <p>
            订单信息将保留至少 5 年，以符合税务和商业记录要求。您可联系我们申请查阅
            或删除您的个人信息（法定保留义务所需的数据除外）。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">7. 未成年人</h2>
          <p>
            本站服务不面向 13 岁以下未成年人。若我们发现误收集了未成年人信息，
            将立即予以删除。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">8. 政策变更</h2>
          <p>
            本站保留随时更新本隐私政策的权利。重大变更将通过网站公告告知用户，
            继续使用本站视为接受更新后的政策。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">9. 联系我们</h2>
          <p>
            如有关于隐私政策的问题，请通过
            <a href="/contact" className="ml-1 text-cyan-400 hover:text-cyan-300">
              联系页面
            </a>
            与我们取得联系。
          </p>
        </section>
      </div>
    </div>
  );
}
