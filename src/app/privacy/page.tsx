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

/**
 * 结构参考日本电商常见隐私政策 + SNKRDUNK/会员购对个人情报与委托处理的写法，
 * 结合本站 Stripe 支付与物流委托场景改写。
 * 本轮仅做信息架构与版式升级，不改变义务边界。
 */

const TOC = [
  { id: "pv-1", label: "01 事业者信息" },
  { id: "pv-2", label: "02 收集的信息" },
  { id: "pv-3", label: "03 利用目的" },
  { id: "pv-4", label: "04 委托与第三方" },
  { id: "pv-5", label: "05 Cookie" },
  { id: "pv-6", label: "06 安全管理" },
  { id: "pv-7", label: "07 保存期间" },
  { id: "pv-8", label: "08 披露与更正" },
  { id: "pv-9", label: "09 未成年人" },
  { id: "pv-10", label: "10 政策变更" },
  { id: "pv-11", label: "11 联系我们" },
];

const KEY_NOTICES = [
  {
    title: "不出售个人信息",
    body: "本站不会出售或出租您的个人信息；仅在履约必要范围内委托支付、物流等服务商。",
  },
  {
    title: "支付由 Stripe 处理",
    body: "卡号等支付敏感信息由 Stripe 处理，本站不存储完整卡号。",
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
          <div className="legal-info-row">
            <span className="legal-info-label">销售业者</span>
            <span className="legal-info-value">{COMPANY_SELLER}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">代表责任者</span>
            <span className="legal-info-value">{COMPANY_REPRESENTATIVE}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">所在地</span>
            <span className="legal-info-value">{COMPANY_ADDRESS}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">电话</span>
            <span className="legal-info-value">{COMPANY_PHONE}（请优先邮件）</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">咨询窗口</span>
            <span className="legal-info-value">
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </span>
          </div>
        </div>
        <p>本站依据日本《个人情报保护法》及相关法令，妥善管理您的个人信息。</p>
      </LegalArticle>

      <LegalArticle id="pv-2" index="02" title="收集的信息">
        <p className="mb-2">本站可能收集以下信息：</p>
        <ul className="list-disc space-y-1">
          <li>身份与联络：姓名、邮箱、电话、收货地址、会员账号信息</li>
          <li>交易信息：订单内容、金额、支付状态、物流单号、售后沟通记录</li>
          <li>支付相关：由 Stripe 处理的支付必要信息（本站不存储完整卡号）</li>
          <li>技术信息：Cookie、设备与浏览器信息、IP、访问日志、语言偏好</li>
          <li>您主动提交的咨询内容、买取申请材料等</li>
        </ul>
      </LegalArticle>

      <LegalArticle id="pv-3" index="03" title="利用目的">
        <ul className="list-disc space-y-1">
          <li>接受订单、确认身份、处理付款与开票相关事务</li>
          <li>安排发货、物流跟踪、售后与退换核实</li>
          <li>账号注册、登录、密码重置、会员服务</li>
          <li>发送订单通知、物流通知、必要的服务邮件</li>
          <li>防范欺诈、拒付滥用、安全事件与风控</li>
          <li>改进网站功能、统计与服务品质（去标识化后可用于分析）</li>
          <li>履行法令义务及应对监管、司法请求</li>
        </ul>
        <LegalCallout tone="info">
          未经您同意，本站不会将个人信息用于与上述目的无关的营销推销（法律允许的除外）。
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="pv-4" index="04" title="委托与第三方提供">
        <ol className="list-decimal space-y-2">
          <li>
            为履行合同，本站可能在必要范围内将信息委托给：支付处理商（Stripe）、物流承运商（如
            EMS、佐川急便等）、云主机与邮件服务商。
          </li>
          <li>
            <LegalCallout>本站不会出售或出租您的个人信息。</LegalCallout>
          </li>
          <li>
            以下情形可提供：您同意时；法令要求时；保护人身财产安全所必需时；业务承继时在法令允许范围内。
          </li>
          <li>跨境传输时，将采取法令要求的适当保护措施。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="pv-5" index="05" title="Cookie 与类似技术">
        <p>
          本站使用 Cookie 维持购物车、登录会话与语言偏好。您可在浏览器禁用 Cookie，但可能导致无法登录、下单或保存购物车。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-6" index="06" title="安全管理">
        <p>
          本站采用 HTTPS 传输，并采取合理的组织与技术措施防止泄露、灭失、损毁。尽管如此，互联网传输与存储无法保证绝对安全，请您知悉并自行保护账号密码。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-7" index="07" title="保存期间">
        <p>
          订单与交易记录原则上至少保存 5 年（或法令要求的更长期间），以满足税务与商业记录义务。达到目的后，将删除或匿名化处理（法令要求保留的除外）。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-8" index="08" title="披露、更正、删除等请求">
        <p>
          您可依法请求披露、更正、追加、删除、利用停止等。请通过
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          或
          <Link href="/contact">联系页面</Link>
          提出。本站将在核实身份后，于合理期限内依法处理；法令允许拒绝的，将说明理由。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-9" index="09" title="未成年人">
        <p>
          本站服务原则上不面向 13 岁以下儿童。若发现误收集，将尽快删除。未成年人使用应经监护人同意。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-10" index="10" title="政策变更">
        <p>
          本站可修订本政策并公布于网站。重大变更将尽量提示。继续使用服务视为知悉更新内容。
        </p>
      </LegalArticle>

      <LegalArticle id="pv-11" index="11" title="联系我们">
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
