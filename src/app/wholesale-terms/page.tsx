import Link from "next/link";
import { B2B_EMAIL, COMPANY_SELLER, SUPPORT_EMAIL } from "@/lib/site";
import { LegalArticle, LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalCallout } from "@/components/legal/LegalCallout";
import { LegalKeyNotices } from "@/components/legal/LegalKeyNotices";

export const metadata = {
  title: "批发合作条款 | PIMART CARD",
};

const TOC = [
  { id: "b2b-1", label: "01 适用范围" },
  { id: "b2b-2", label: "02 报价与有效期" },
  { id: "b2b-3", label: "03 起订量与定金" },
  { id: "b2b-4", label: "04 缺货与分配" },
  { id: "b2b-5", label: "05 取消与变更" },
  { id: "b2b-6", label: "06 物流、税费与风险" },
  { id: "b2b-7", label: "07 验收与售后" },
  { id: "b2b-8", label: "08 禁止行为" },
  { id: "b2b-9", label: "09 管辖与联系" },
];

const KEY_NOTICES = [
  { title: "批发报价需书面确认", body: "LINE、邮件或表格中的口头沟通不当然构成最终报价，最终以本站书面确认单为准。" },
  { title: "大货订单原则不可取消", body: "定金、订金、预留库存及特别采购订单，除本站同意外原则上不可取消或无理由退款。" },
  { title: "缺货按规则分配", body: "供应商削减、发行商延期或物流异常时，本站可按付款顺序、合作历史和库存情况分配。" },
  { title: "税费与清关由买方承担", body: "海外批发订单产生的关税、进口税、清关费、目的国合规责任原则上由买方承担。" },
];

export default function WholesaleTermsPage() {
  return (
    <LegalPageShell
      active="terms"
      title="批发合作条款"
      subtitle="B2B / Wholesale Terms"
      updatedAt="2026年7月13日"
      sellerLabel={`事业者：${COMPANY_SELLER}`}
      toc={TOC}
      notices={<LegalKeyNotices heading="批发要点" items={KEY_NOTICES} />}
    >
      <LegalArticle id="b2b-1" index="01" title="适用范围">
        <ol className="list-decimal space-y-2">
          <li>本条款适用于 PIMART CARD 与店铺、经销商、采购代理、批量采购客户之间的批发、长期供货、预订配货、定期补货及其他 B2B 合作。</li>
          <li>若双方另行签署书面合同、报价单、订单确认书或发票，其特别约定优先；未约定部分适用本条款及本站用户协议。</li>
          <li>B2B 交易不适用面向普通消费者的无理由退换或零售促销规则。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-2" index="02" title="报价与有效期">
        <ol className="list-decimal space-y-2">
          <li>批发价格受库存、汇率、发行计划、市场供需、供应商条件和物流成本影响，可能随时变化。</li>
          <li>报价有效期以报价单或邮件载明为准；未载明的，原则上仅当日有效。</li>
          <li>报价不含关税、进口消费税、清关手续费、目的地本地配送费及其他第三方费用，除非报价单明确写明已包含。</li>
          <li><LegalCallout>最终交易价格、数量、付款方式、发货安排，均以本站书面确认的订单或发票为准。</LegalCallout></li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-3" index="03" title="起订量、定金与付款">
        <ol className="list-decimal space-y-2">
          <li>不同商品可设置最小起订量、整箱倍数、限购数量或配货比例。</li>
          <li>预售、特别采购、大货锁货或供应商预留库存订单，本站可要求支付定金、订金或全款。</li>
          <li>买方未在约定期限内付款的，本站可取消报价、释放库存或调整价格；因此造成的库存损失、汇率差或采购成本，由买方承担。</li>
          <li>除本站书面确认外，定金、订金、锁货费用和已发生的采购/物流成本原则上不退还。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-4" index="04" title="缺货、削减与分配">
        <ol className="list-decimal space-y-2">
          <li>若发行商、供应商、物流、清关或不可抗力导致缺货、延期、削减配额，本站可通知买方并调整发货数量、分批发货、替换商品或退款未履行部分。</li>
          <li>库存不足时，本站可综合付款时间、合作记录、订单金额、商品限制和实际到货量进行分配。</li>
          <li>缺货、削减或延期本身不构成本站对买方转售利润、机会损失、店铺信誉损失或其他间接损失的赔偿责任。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-5" index="05" title="取消、变更与不可抗力">
        <ol className="list-decimal space-y-2">
          <li>订单经本站确认或买方付款后，买方不得因市场价格变化、客户取消、转售失败、汇率变动或个人经营判断要求取消、退款、补差或赔偿。</li>
          <li>确需变更收货信息、发票信息、配送方式或商品数量的，应在发货前书面提出；本站有权根据实际进度决定是否接受。</li>
          <li>因地震、台风、疫情、战争、海关政策、支付机构、承运商、发行商、供应商等非本站可控因素导致无法履约的，本站可延期、分批、取消未履行部分或退款未履行部分。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-6" index="06" title="物流、税费与风险转移">
        <ol className="list-decimal space-y-2">
          <li>发货方式、包装方式、保险、运费和承运商以双方书面确认为准。</li>
          <li>海外订单的关税、进口税、清关费、目的国许可、标签、再销售合规及当地法规责任，原则上由买方承担。</li>
          <li>商品交付承运商、完成签收、代签、仓库入库或物流显示妥投后，灭失与损坏风险按约定或适用法律转移给买方。</li>
          <li>买方指定承运商、转运仓、第三方仓库或自行安排提货的，相关风险和费用由买方承担。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-7" index="07" title="验收、售后与举证">
        <ol className="list-decimal space-y-2">
          <li>买方应在收货后立即验货；破损、错发、漏发等问题须在签收后 7 日内书面提出。</li>
          <li>申请售后须提供订单号、箱数、外箱照片、面单、托盘/整箱照片、开箱视频、问题商品照片及本站要求的其他资料。</li>
          <li>轻微外箱压痕、封膜褶皱、行情波动、开封结果、买方二次运输/仓储造成的损坏，不属于本站售后责任。</li>
          <li>经确认属本站责任的，本站可选择补发、换货、抵扣后续货款或退还对应问题商品实付金额。</li>
        </ol>
      </LegalArticle>

      <LegalArticle id="b2b-8" index="08" title="禁止行为与合作终止">
        <ul className="list-disc space-y-1">
          <li>使用盗刷、欺诈、洗钱、虚假身份或来源不明资金付款。</li>
          <li>恶意拒付、虚假售后、伪造破损证据、调包、重封或侵犯第三方权利。</li>
          <li>绕过本站报价体系、攻击网站、批量抓取库存、干扰正常经营。</li>
          <li>违反商品权利方、目的国海关、进口、标签、销售或消费者保护法规。</li>
        </ul>
        <LegalCallout tone="warn">出现上述情形时，本站可暂停报价、取消未履行订单、终止合作，并依法保留追偿权利。</LegalCallout>
      </LegalArticle>

      <LegalArticle id="b2b-9" index="09" title="适用法律、管辖与联系">
        <p className="mb-3">本条款受日本法律管辖。双方应先友好协商；协商不成的，提交日本东京地方法院为第一审专属合意管辖法院。</p>
        <p>
          批发合作：<a href={`mailto:${B2B_EMAIL}`}>{B2B_EMAIL}</a> ｜ 客服：<a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> ｜ <Link href="/wholesale">返回批发合作页</Link>
        </p>
      </LegalArticle>
    </LegalPageShell>
  );
}