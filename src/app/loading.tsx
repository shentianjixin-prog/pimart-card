import { cookies } from "next/headers";
import { resolveLang, t } from "@/lib/translations";

export default async function Loading() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="page-loading-mark" aria-hidden="true" />
      <p>{t("status_loading", lang)}</p>
    </div>
  );
}
