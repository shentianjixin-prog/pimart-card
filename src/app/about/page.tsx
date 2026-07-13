import Link from "next/link";
import { cookies } from "next/headers";
import { B2B_EMAIL, SUPPORT_EMAIL } from "@/lib/site";
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
        <p className="legal-subtitle">PIMART CARD · Global Sealed &amp; B2B</p>
        <div className="legal-meta-row">
          <span className="legal-chip">Japan Hub</span>
          <span className="legal-chip">Worldwide Shipping</span>
          <span className="legal-chip">B2B Ready</span>
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

        <div className="legal-crosslinks mt-2">
          <p className="legal-crosslinks-heading">
            {T("about_support_label")} / {T("about_b2b_label")}
          </p>
          <div className="legal-crosslinks-row">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="legal-crosslink">
              {SUPPORT_EMAIL}
            </a>
            <a href={`mailto:${B2B_EMAIL}`} className="legal-crosslink">
              {B2B_EMAIL}
            </a>
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
    </div>
  );
}
