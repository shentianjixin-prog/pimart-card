import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_REPRESENTATIVE,
  COMPANY_SELLER,
  SUPPORT_EMAIL,
} from "@/lib/site";
import { LegalCallout } from "@/components/legal/LegalCallout";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";
import { LegalArticle, LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "隐私政策 | PIMART CARD",
};

const TOC = [
  { id: "pv-1", label: "01 事业者信息" },
  { id: "pv-2", label: "02 收集的信息" },
  { id: "pv-3", label: "03 利用目的" },
  { id: "pv-4", label: "04 委托与第三方" },
  { id: "pv-5", label: "05 Cookie 与风控" },
  { id: "pv-6", label: "06 跨境处理" },
  { id: "pv-7", label: "07 安全管理" },
  { id: "pv-8", label: "08 保存期间" },
  { id: "pv-9", label: "09 披露与更正" },
  { id: "pv-10", label: "10 未成年人" },
  { id: "pv-11", label: "11 政策变更" },
  { id: "pv-12", label: "12 联系我们" },
];

const KEY_NOTICES = [
  {
    title: "不出售个人信息",
    body: "本站不会出售或出租您的个人信息；仅在履约、安全、法定义务必要范围内委托支付、物流等服务商。",
  },
  {
    title: "支付由 Stripe 处理",
    body: "卡号、安全码等支付敏感信息由 Stripe 处理，本站不存储完整卡号。",
  },
  {
    title: "风控日志用于安全保护",
    body: "为防止盗刷、恶意拒付、批量注册和接口滥用，本站会记录必要的访问与操作日志。",
  },
  {
    title: "可依法请求更正或删除",
    body: "您可通过客服邮箱依法请求披露、更正、删除或利用停止；核实身份后处理。",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      active="privacy"
      title="隐私政策"
      subtitle="プライバシーポリシー / Privacy Policy"
      updatedAt="2026年7月13日"
      sellerLabel={`事业者：${COMPANY_SELLER}`}
      toc={TOC}
      notices={<LegalKeyNotices heading="隐私要点" items={KEY_NOTICES} />}
    >
      <LegalArticle id="pv-1" index="01" title="事业者信息">
        <div className="legal-info-card">
          <div className="legal-info-row"><span className="legal-info-label">销售业者</span><span className="legal-info-value">{COMPANY_SELLER}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">代表责任者</span><span className="legal-info-value">{COMPANY_REPRESENTATIVE}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">所在地</span><span className="legal-info-value">{COMPANY_ADDRESS}</span></div>
          <div className="legal-info-row"><span className="legal-info-label">电话</span><span className="legal-info-value">{COMPANY_PHONE}（请优先邮件）</span></div>
          <div className="legal-info-row"><span className="legal-info-label">咨询窗口</span><span className="legal-info-value"><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></span></div>
        </div>
        <p>本站依据日本《个人情报保护法》及相关法令，妥善管理您的个人信息。</p>
      </LegalArticle>

      <LegalArticle id="pv-2" index="02" title="收集的信息">
        <p className="mb-2">本站可能收集以下信息：</p>
        <ul className="list-disc space-y-1">
          <li>账号信息：昵称、邮箱、密码加密摘要、登录状态、会员设置</li>
          <li>身份与联络：姓名、电话、收货地址、会员账号信息</li>
          <li>交易信息：订单内容、金额、支付状态、物流单号、退款与售后沟通记录</li>
          <li>买取申请信息：姓名、生日、地址、电话、邮箱、职业、银行账户、本人确认证件类型、买取商品信息、反社会势力确认及权属声明</li>
          <li>支付相关：支付金额、币种、支付结果、Stripe 返回的交易识别信息；本站不存储完整卡号或安全码</li>
          <li>技术与安全信息：Cookie、设备与浏览器信息、IP、访问日志、语言偏好、失败登录次数、请求频率、风控命中记录</li>
          <li>您主动提交的咨询内容、买取申请材料、售后证据照片或视频等</li>
        </ul>
      </LegalArticle>

      <LegalArticle id="pv-3" index="03" title="利用目的">
        <ul className="list-disc space-y-1">
          <li>接受订单、确认身份、处理付款、退款与开票相关事务</li>
          <li>安排发货、物流跟踪、售后与退换核实</li>
          <li>账号注册、登录、密码重置、会员服务</li>
          <li>处理卡牌买取申请、本人确认、査定、汇款、税务及古物相关合规记录</li>
          <li>发送订单通知、物流通知、必要的服务邮件</li>
          <li>防范欺诈、盗刷、拒付滥用、批量请求、接口滥用、安全事件与漏洞利用</li>
          <li>改进网站功能、统计与服务品质（去标识化后可用于分析）</li>
          <li>履行法令义务及应对监管、司法、税务或警察机关请求</li>
        </ul>
        <LegalCallout tone="info">
          未经您同意，本站不会将个人信息用于与上述目的无关的营销推销（法律允许的除外）。
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="pv-4" index="04" title="委托与第三方提供">
        <ol className="list-decimal space-y-2">
          <li>为履行合同，本站可能在必要范围内将信息委托给：支付处理商（Stripe）、物流承运商（如 EMS、佐川急便等）、仓储/配送协力方、云主机、数据库、邮件发送、错误监控和安全防护服务商。</li>
          <li><LegalCallout>本站不会出售或出租您的个人信息，也不会将个人信息提供给与交易履行无关的第三方用于其独立营销。</LegalCallout></li>
          <li>以下情形可提供：您同意时；法令要求时；法院、监管机关、警察、税务机关或法律程序要求时；保护人身财产安全所必需时；业务承继时在法令允许范围内。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="pv-5" index="05" title="Cookie、日志与风控技术">
        <ol className="list-decimal space-y-2">
          <li>本站使用 Cookie 维持购物车、登录会话、语言偏好和基础安全校验。禁用 Cookie 可能导致无法登录、下单或保存购物车。</li>
          <li>为保护账号与交易安全，本站可能记录访问频率、请求来源、失败登录、异常表单提交和支付风险信号，并据此进行限速、拦截、复核或要求补充信息。</li>
          <li>本站不会使用 Cookie 获取与本站服务无关的敏感个人信息。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="pv-6" index="06" title="跨境处理与保存地点">
        <p>
          本站面向日本及跨境用户提供服务，订单、支付、云服务、邮件、物流或客服数据可能在日本以外的国家或地区被处理。我们会在合理范围内选择具备安全管理措施的服务商，并仅在达成使用目的所需范围内传输信息。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-7" index="07" title="安全管理">
        <p>
          本站采用 HTTPS、密码哈希、访问控制、基础速率限制、安全响应头、第三方支付托管等合理的组织与技术措施，防止泄露、灭失、损毁和滥用。尽管如此，互联网传输与存储无法保证绝对安全，请您知悉并自行保护账号密码。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-8" index="08" title="保存期间">
        <ul className="list-disc space-y-1">
          <li>订单、支付、配送、售后和会计相关记录通常至少保存 5 年，或依适用法律要求保存更长时间。</li>
          <li>买取、本人确认、査定、汇款及古物相关记录，会按日本法律、税务和争议处理需要保存。</li>
          <li>账号信息在用户注销或长期不使用后可申请删除，但为履行法定义务、处理争议、防止滥用而必须保留的信息除外。</li>
          <li>安全日志会在达成风控、安全审计和故障排查目的所需期间内保存。</li>
        </ul>
      </LegalArticle>

      <LegalArticle id="pv-9" index="09" title="披露、更正、删除等请求">
        <p>
          您可依法请求披露、更正、追加、删除、利用停止、停止向第三方提供等。请通过
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          或
          <Link href="/contact">联系页面</Link>
          提出。本站将在核实身份后，于合理期限内依法处理；法令允许拒绝的，将说明理由。若相关信息属于交易履行、税务、会计、风控、争议处理或法律规定必须保存的信息，本站可能无法立即删除，但会限制在必要目的内使用。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-10" index="10" title="未成年人">
        <p>
          本站服务原则上不面向 13 岁以下儿童。未成年人使用本站进行购买、预售、买取或提交个人信息前，应取得监护人同意。若发现误收集，将尽快删除或采取必要限制。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-11" index="11" title="政策变更">
        <p>本站可因业务、法律或安全要求修订本政策并公布于网站。重大变更将尽量提示。继续使用服务视为知悉更新内容。</p>
      </LegalArticle>

      <LegalArticle id="pv-12" index="12" title="联系我们">
        <p>
          隐私相关咨询：
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          {" ｜ "}
          <Link href="/contact">联系页面</Link>
          {" ｜ 电话 "}
          {COMPANY_PHONE}（请优先邮件）
        </p>
      </LegalArticle>
    </LegalPageShell>
  );
}
