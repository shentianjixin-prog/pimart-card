import Link from "next/link";
import { cookies } from "next/headers";
import {
  B2B_EMAIL,
  CHINA_REGION_REPRESENTATIVE,
  COMPANY_ADDRESS,
  COMPANY_FOUNDED_YEAR,
  COMPANY_PHONE,
  COMPANY_REPRESENTATIVE,
  COMPANY_SELLER,
  JAPAN_DELIVERY_CONTACT_ADDRESS,
  PAYMENT_METHODS,
  SUPPORT_EMAIL,
} from "@/lib/site";
import { t, resolveLang } from "@/lib/translations";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  return (
    <div className="legal-shell">
      <header className="legal-hero">
        <p className="legal-eyebrow">About · 品牌</p>
        <h1 className="legal-title">{T("footer_about")}</h1>
        <div className="legal-meta-row">
          <span className="legal-chip">
            {T("about_founded_label")} {COMPANY_FOUNDED_YEAR}
          </span>
        </div>
      </header>

      <div className="legal-main mt-6">
        <article className="legal-article">
          <div className="legal-article-body space-y-5 text-[0.975rem] leading-[1.9]">
            <p>{T("about_p1")}</p>
            <p>{T("about_p2")}</p>
            <p>{T("about_p3")}</p>
            <p>{T("about_p4")}</p>
          </div>
        </article>

        <div className="legal-info-card mt-1">
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_founded_label")}</span>
            <span className="legal-info-value">{COMPANY_FOUNDED_YEAR}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_company_label")}</span>
            <span className="legal-info-value">{COMPANY_SELLER}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_rep_label")}</span>
            <span className="legal-info-value">{COMPANY_REPRESENTATIVE}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_china_rep_label")}</span>
            <span className="legal-info-value">{CHINA_REGION_REPRESENTATIVE}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_address_label")}</span>
            <span className="legal-info-value">{COMPANY_ADDRESS}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_phone_label")}</span>
            <span className="legal-info-value">{COMPANY_PHONE}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_japan_delivery_label")}</span>
            <span className="legal-info-value">{JAPAN_DELIVERY_CONTACT_ADDRESS}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_payment_label")}</span>
            <span className="legal-info-value">{PAYMENT_METHODS[lang]}</span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_support_label")}</span>
            <span className="legal-info-value">
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </span>
          </div>
          <div className="legal-info-row">
            <span className="legal-info-label">{T("about_b2b_label")}</span>
            <span className="legal-info-value">
              <a href={`mailto:${B2B_EMAIL}`}>{B2B_EMAIL}</a>
            </span>
          </div>
        </div>

        <div className="legal-crosslinks-row mt-2">
          <Link href="/wholesale" className="legal-crosslink">
            {T("footer_wholesale")}
          </Link>
          <Link href="/contact" className="legal-crosslink">
            {T("footer_contact")}
          </Link>
          <Link href="/" className="legal-crosslink">
            {T("page_back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
