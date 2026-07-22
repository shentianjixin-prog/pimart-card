import Link from "next/link";
import {
  B2B_EMAIL,
  CHINA_REGION_REPRESENTATIVE,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_REPRESENTATIVE,
  COMPANY_SELLER,
  JAPAN_DELIVERY_CONTACT_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site";
import { LegalCallout } from "@/components/legal/LegalCallout";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";
import { LegalArticle, LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "用户协议 | PIMART CARD",
};

const TOC = [
  { id: "art-1", label: "01 总则与购前同意" },
  { id: "art-2", label: "02 账户与资格" },
  { id: "art-3", label: "03 商品与价格" },
  { id: "art-4", label: "04 订单与取消" },
  { id: "art-5", label: "05 支付与风控" },
  { id: "art-6", label: "06 发货与签收" },
  { id: "art-7", label: "07 预售延期退款" },
  { id: "art-8", label: "08 特殊品类" },
  { id: "art-9", label: "09 售后与举证" },
  { id: "art-10", label: "10 随机性与品相" },
  { id: "art-11", label: "11 买取暂停" },
  { id: "art-12", label: "12 禁止行为" },
  { id: "art-13", label: "13 免责范围" },
  { id: "art-14", label: "14 协议变更" },
  { id: "art-15", label: "15 管辖与联系" },
];

const KEY_NOTICES = [
  {
    title: "下单即视为同意本协议",
    body: "浏览、加购、提交订单并完成付款，即视为已阅读、理解并同意本协议、商品页说明及当时有效规则。",
  },
  {
    title: "特殊品不适用笼统七天无理由",
    body: "未开封原盒、补充包、预售、随机/开封类等特殊商品，个人原因退换原则不接受。",
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      active="terms"
      title="用户协议"
      subtitle="利用規約 / Terms of Use"
      updatedAt="2026年7月23日"
      toc={TOC}
      notices={<LegalKeyNotices items={KEY_NOTICES} />}
    >
      <LegalArticle id="art-1" index="01" title="总则与购前同意">
        <ol className="list-decimal space-y-2">
          <li>
            本协议是您与 {COMPANY_SELLER}（以下简称「本站」）之间，就使用 PIMART CARD
            网站、购买商品及使用相关服务所订立的具有约束力的协议。运营负责人：{COMPANY_REPRESENTATIVE}。
          </li>
          <li>
            不同商品适用不同售后政策（现货 / 预售 / 未开封原盒 / 随机商品等），将在商品详情页及本协议、
            <Link href="/tokusho">特定商取引法表記</Link>、
            <Link href="/faq#returns">售后说明</Link>
            中公示。不一致时，以商品页特别说明优先；商品页未说明的，以本协议为准。
          </li>
          <li>
            <LegalCallout tone="warn">
              您浏览商品、加入购物车、提交订单并完成付款，即视为已阅读、理解并同意本协议及当时有效的全部相关规则，并愿意承担相应后果。如不同意，请勿下单。
            </LegalCallout>
          </li>
          <li>本站非各 IP（宝可梦、海贼王等）官方授权零售商；所售为正版流通商品，商标归权利人所有。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-2" index="02" title="账户与使用资格">
        <ol className="list-decimal space-y-2">
          <li>您应提供真实、准确、完整的注册、支付与收货信息，并及时更新。</li>
          <li>账号、密码、邮箱验证码及登录状态由您自行保管；通过您的账号发生的操作，原则上视为您的行为。</li>
          <li>因您提供错误地址、联系方式或拒不配合核实导致无法履约的，本站有权取消订单或暂停发货，相关损失由您承担。</li>
          <li>未成年人应在监护人同意下使用本站服务；监护人应对相关行为负责。</li>
          <li>同一用户不得通过多账号、虚假资料、自动化脚本、恶意占库存、刷单、薅活动、恶意拒付或倒卖系统漏洞等方式影响本站正常经营。</li>
          <li>本站有权在合理怀疑欺诈、滥用优惠、恶意退换、扰乱经营、盗刷、洗钱或绕过风控等情形时，限制账号、取消订单、暂停发货或要求补充身份与交易证明。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-3" index="03" title="商品信息、库存与价格">
        <ol className="list-decimal space-y-2">
          <li>商品名称、图片、价格、库存、发货说明以商品页及结账页展示为准。图片仅为示意，实物品相以 sealed / 评级状态及页面说明为准。</li>
          <li>价格以日元（JPY）标示；税费是否含税以页面标注为准。结账金额以 Stripe 支付页最终显示为准。</li>
          <li>商品图片、翻译、系列名称、发售日、稀有度、市场参考价等信息仅用于帮助识别商品，最终以商品实物、发行商公开信息及商品页面明确标注为准。</li>
          <li>
            集换式卡牌和未开封商品存在行情波动。本站<strong>不对商品是否满足您的特定收藏目标、投资收益、转售利润或其他特定目的</strong>
            作任何明示或默示担保。
          </li>
          <li>二级市场行情仅供参考，不构成投资建议，亦不作为退换货、取消订单、补差或赔偿依据。</li>
          <li>因系统错误、库存同步延迟、供应商缺货、价格明显异常、支付异常或不可抗力导致订单无法履行时，本站可取消订单并退还已支付款项。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-4" index="04" title="订单成立、缺货与取消">
        <ol className="list-decimal space-y-2">
          <li>您提交订单并完成付款后，除本协议另有约定外，合同成立。</li>
          <li>因市场波动、供应商计划变更、系统故障、不可抗力等，可能出现缺货。本站将尽快通知您，并可采取取消订单并退还实付金额、协商换货/调货等方案。</li>
          <li>
            <LegalCallout>订单成立后，除本站书面同意或本协议特别约定外，您不得单方取消。</LegalCallout>
          </li>
          <li>付款完成后，除本协议明确列明的可退款情形外，<strong>原则上不支持退款</strong>。</li>
          <li>预售、随机、补充包、未开封盒、限量商品及个人订购商品，尤其不适用无理由取消。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-5" index="05" title="支付与风控">
        <ol className="list-decimal space-y-2">
          <li>支付方式：信用卡等由 Stripe 提供的方式（Visa / Mastercard / JCB 等，以结账页可选为准）。</li>
          <li>支付信息由 Stripe 处理；本站不存储完整卡号或信用卡安全码。</li>
          <li>支付失败、发卡行拒付、风控拦截导致无法完成的，视为订单未成立。</li>
          <li>请使用本人合法支付方式。盗刷、恶意拒付、虚假售后、异常高频下单或支付风险命中，可能导致订单取消、账号限制或进一步核验。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-6" index="06" title="发货、配送与签收">
        <ol className="list-decimal space-y-2">
          <li>本站以亚洲为履约枢纽。具体发货地、预计时效以商品页、订单及结账说明为准；不同商品可能从不同地点发出。</li>
          <li>
            <strong>预售及其他标注「预计发货 / 到货时间」的时间仅为参考时间</strong>
            ，可能因厂商出荷、质检返工、库存调配、清关、承运、目的地等因素产生偏差；实际发货时间以本站实际发货为准。
          </li>
          <li>运费以结账页为准。目的地关税、税费、清关手续费由买家承担；本站不垫付、不承诺免税通关。</li>
          <li>因海关查验、地址错误、长期无人签收、无正当理由拒签、逾期取件、海关资料不完整等导致的延误、退回、毁损灭失风险及费用，由买家承担。</li>
          <li>
            商品完成签收、代签、投递柜入库或物流显示妥投后，灭失和损坏风险原则上转移给用户。
            <LegalCallout tone="warn">
              签收时请核对外包装；建议从未开封外箱开始拍摄完整开箱视频。若发现明显破损、浸水、拆封、少件等情况，请保留外箱、面单、内包装与连续照片。
            </LegalCallout>
          </li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-7" index="07" title="预售延期退款">
        <ol className="list-decimal space-y-2">
          <li>预售商品会在商品页标明「预售」并展示预计发货/到货时间。</li>
          <li>
            <LegalCallout tone="info">
              若自该商品首次展示的预计发货日起满 90 日仍未发货，且订单尚未发货，您可就该商品申请按实付金额退款。
            </LegalCallout>
          </li>
          <li>若预计时间仅标到「某月」，起算日取该月最后一日。</li>
          <li>已发货、已签收或因您原因导致无法发货的，不适用本条。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-8" index="08" title="特殊品类：不适用笼统「七天无理由」">
        <p className="mb-2">
          因商品性质特殊，以下品类<strong>不适用笼统的七天无理由退货</strong>
          ；个人原因退换请自行处理。商品页将作出提示；
          <strong>您选择购买，即视为同意相关规则并愿意承担相应费用与后果。</strong>
        </p>
        <ul className="list-disc space-y-1">
          <li>未开封原盒、补充包、礼盒、双盒装、整箱等 sealed 商品</li>
          <li>预售商品（含定金/全款预售）</li>
          <li>一经售出难以按新品二次销售的特殊商品（商品页另行标注）</li>
          <li>明示随机、福袋、盲盒、组合包或「开封结果随机」的商品</li>
          <li>商品页另行标注「不支持无理由退换」的商品</li>
        </ul>
        <p className="mt-2">不支持的个人原因包括但不限于：不喜欢、买多了、想换款、尺寸/款式预期不符、二级市场价格波动、开封后抽卡结果不理想等。</p>
      </LegalArticle>

      <LegalArticle id="art-9" index="09" title="售后范围、举证与处理">
        <ol className="list-decimal space-y-2">
          <li><strong>可受理范围</strong>：运输导致的明显外包装破损致商品实质受损、错发、漏发、明显初期不良；须能合理证明问题在签收时即已存在。</li>
          <li><strong>非售后范围（示例）</strong>：个人原因；已拆封/已开封；外箱轻微压痕、角损、工厂原有轻微瑕疵且不影响 sealed 完整性；您自行二次包装、转运、仓储不当造成的损坏；开封后的卡牌内容与期望不符。</li>
          <li><LegalCallout>请于物流签收后 7 日内联系客服（{SUPPORT_EMAIL}）提出申请。逾期、证据不足或已自行丢弃包装的，本站有权不予受理。</LegalCallout></li>
          <li><strong>举证</strong>：须提供订单号、物流单号、完整开箱视频（建议从封闭包裹连续拍到取出商品）、外箱/面单/商品清晰照片及其他本站要求的材料。</li>
          <li><strong>处理方式</strong>：经核实属本站责任的，本站可优先安排补发或换货；无合理库存时可退还该商品实付金额。本站不接受到付退货。</li>
          <li>退货商品在本站签收前的风险由您承担；您应在收到可寄回通知后 7 日内寄出并提供单号，超时寄出的，本站有权对同一事由再次主张不予处理。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-10" index="10" title="随机性、开封结果与品相">
        <ol className="list-decimal space-y-2">
          <li>集换式卡牌开封结果具有随机性，可能出现重复或不含您期望的特定卡牌。</li>
          <li>本站不保证特定卡牌、卡号、签名、隐藏款、评级分数、保底结果或二级市场价格，亦不对开封结果承担退款或赔偿义务。</li>
          <li>同一批次商品可能存在封膜轻微褶皱、外盒压痕、角部磨损、印刷差异、厂商封装误差等情况。未影响商品主要功能和收藏识别的轻微外观差异，通常不视为质量问题。</li>
          <li>不得以卡位、卡序、称重、摇盒、封膜纹理、网络传闻或二级市场价格为依据主张退换、差价补偿或额外赔偿。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-11" index="11" title="买取服务暂停">
        <p>本站目前不提供卡牌买取服务，不接受买取申请或商品寄送，也不收集买取用途的身份证明、银行账户等资料。恢复时间以网站后续公告为准。</p>
      </LegalArticle>

      <LegalArticle id="art-12" index="12" title="禁止行为">
        <p className="mb-2">您不得从事以下行为，否则本站有权采取限制账号、取消订单、追究责任等措施：</p>
        <ul className="list-disc space-y-1">
          <li>提供虚假信息、盗用他人身份或支付方式</li>
          <li>攻击、扫描、爬取、压测、逆向、绕过限速、干扰支付流程、批量注册、批量占库存、篡改请求、上传恶意内容或利用本站漏洞获利</li>
          <li>恶意拒付、虚假售后主张、重复纠缠同一已结案事由</li>
          <li>冒用他人身份、盗刷、洗钱、诽谤本站或其他用户、侵犯知识产权、违反经营者所在地、交易履行地或用户所在地适用的法律法规</li>
        </ul>
      </LegalArticle>

      <LegalArticle id="art-13" index="13" title="免责与责任范围">
        <ol className="list-decimal space-y-2">
          <li>因不可抗力、承运商、海关、支付机构、发行商延期、供应商违约等原因造成的延误、丢失或损坏，本站在已履行合理包装与发货义务的前提下，责任以承运商理赔范围及本协议约定为限。</li>
          <li>在法律允许的最大范围内，本站就本协议项下的赔偿责任以您就争议订单实际支付的商品价款为上限（不含运费、关税等第三方费用，法律另有强制规定的除外）。</li>
          <li>本站不对用户因投资、转卖、收藏预期、行情判断、抽卡结果、平台外交易或第三方服务故障造成的间接损失、机会损失、利润损失、商誉损失承担责任。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="art-14" index="14" title="协议变更">
        <p>本站有权更新本协议。更新后公布于网站即生效；您于生效后继续下单或使用服务，视为接受更新后的条款。重大变更将尽量通过网站提示告知。</p>
      </LegalArticle>

      <LegalArticle id="art-15" index="15" title="适用法律、管辖与联系方式">
        <p className="mb-4">本协议原则上适用中华人民共和国法律，但不排除消费者所在地依法不得排除的强制性保护规定。因本协议引起的争议，双方应先协商；协商不成的，在法律允许范围内提交经营者所在地有管辖权的人民法院处理，强制性消费者保护规则另有规定的除外。</p>
        <div className="legal-info-card">
          <div className="legal-info-row"><span className="legal-info-label">销售业者</span><span className="legal-info-value">{COMPANY_SELLER}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">运营负责人</span><span className="legal-info-value">{COMPANY_REPRESENTATIVE}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">中国地区负责人</span><span className="legal-info-value">{CHINA_REGION_REPRESENTATIVE}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">经营者所在地</span><span className="legal-info-value">{COMPANY_ADDRESS}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">日本配送联络地址</span><span className="legal-info-value">{JAPAN_DELIVERY_CONTACT_ADDRESS}（非销售主体所在地；退货地址以客服书面指示为准）</span></div>
          <div className="legal-info-row"><span className="legal-info-label">电话</span><span className="legal-info-value">{COMPANY_PHONE}（请优先邮件）</span></div>
          <div className="legal-info-row"><span className="legal-info-label">客服</span><span className="legal-info-value"><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{" ｜ "}<Link href="/contact">联系页面</Link></span></div>
          <div className="legal-info-row"><span className="legal-info-label">批发合作</span><span className="legal-info-value"><a href={`mailto:${B2B_EMAIL}`}>{B2B_EMAIL}</a>{" ｜ "}<Link href="/wholesale">批发合作页</Link></span></div>
        </div>
      </LegalArticle>
    </LegalPageShell>
  );
}
