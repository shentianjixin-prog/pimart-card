import Link from "next/link";
import { cookies } from "next/headers";
import { resolveLang, t } from "@/lib/translations";

export default async function NotFound() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);

  return (
    <div className="state-page">
      <p className="state-page-code">404</p>
      <h1>{t("status_not_found_title", lang)}</h1>
      <p>{t("status_not_found_body", lang)}</p>
      <div className="state-page-actions">
        <Link href="/?stock=instock" className="btn-primary">
          {t("hero_v2_cta_new", lang)}
        </Link>
        <Link href="/" className="btn-secondary">
          {t("status_not_found_home", lang)}
        </Link>
      </div>
    </div>
  );
}
