export const metadata = {
  title: "服务条款 | PIMART CARD",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-white">服务条款</h1>
      <p className="mb-6 text-sm text-gray-400">最后更新：2026年6月26日</p>

      <div className="space-y-8 text-sm leading-relaxed text-gray-300">
        <section>
          <h2 className="mb-3 text-base font-semibold text-white">1. 服务说明</h2>
          <p>
            PIMART CARD（以下简称"本站"）是一个销售日本·中国正版 TCG 集换式卡牌及相关周边产品的
            在线商店，涵盖宝可梦、海贼王、火影忍者等品类，面向在日本的用户提供直邮服务。
            本站由个人运营，非各 IP 官方授权零售商。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">2. 订单与付款</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>所有价格以日元（JPY）标注，含日本消费税（10%）</li>
            <li>通过 Stripe 支持 Visa、Mastercard、JCB 等主流信用卡付款</li>
            <li>订单提交后即视为要约，本站确认发货后合同成立</li>
            <li>因库存变动，本站有权在付款前拒绝或取消订单并全额退款</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">3. 发货与物流</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>日本仓库发货：付款确认后 <strong className="text-white">3 个工作日</strong>内发出</li>
            <li>中国海外直邮：付款确认后 <strong className="text-white">7〜14 个工作日</strong>到货</li>
            <li>预售商品将在到货后优先安排发货，具体时间以商品页面标注为准</li>
            <li>运费在结账时显示，含基本物流追踪服务</li>
            <li>海外直邮如产生关税，费用由买家承担</li>
            <li>本站不对海关延误、自然灾害等不可抗力造成的延误负责</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">4. 退换货政策</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              集换式卡牌包、盲盒类商品因其随机性，
              <strong className="text-white">注文確定後のキャンセル・返品・交換はお受けできません</strong>
            </li>
            <li>
              商品到达后若存在初期不良、破损或错发，请在
              <strong className="text-white"> 7 天内</strong>联系我们并附上照片
            </li>
            <li>确认为本站责任的问题，将安排补发或退款处理</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">5. 知识产权</h2>
          <p>
            宝可梦（Pokémon）及相关商标、图像均为 Nintendo / Creatures Inc. / GAME FREAK inc.
            的注册商标。本站销售的为正版商品，并非官方授权零售渠道。
            本站网站内容（Logo、设计等）为本站原创，未经许可不得复制或使用。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">6. 免责声明</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>集换式卡牌开封结果具有随机性，本站不对特定卡牌的获取作出保证</li>
            <li>二级市场价格仅供参考，不构成投资建议</li>
            <li>本站不对因商品使用不当造成的损失负责</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">7. 适用法律</h2>
          <p>
            本服务条款受日本法律管辖。因本条款引起的争议，双方应首先协商解决；
            协商不成的，提交日本东京地方法院管辖。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">8. 条款变更</h2>
          <p>
            本站保留随时修改本服务条款的权利。修改后的条款将在网站公布后立即生效，
            继续使用本站服务视为接受更新后的条款。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">9. 联系我们</h2>
          <p>
            如对本条款有任何疑问，请通过
            <a href="/contact" className="ml-1 text-cyan-400 hover:text-cyan-300">
              联系页面
            </a>
            与我们联系。
          </p>
        </section>
      </div>
    </div>
  );
}
