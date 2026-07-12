import Link from "next/link";
import { cookies } from "next/headers";
import { B2B_EMAIL, SUPPORT_EMAIL } from "@/lib/site";
import { t, resolveLang } from "@/lib/translations";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  return (
    <div className="section-tone-default mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="section-title">{T("footer_about")}</h1>
      <div className="surface mt-8 space-y-4 p-8 text-sm leading-relaxed text-[#374151]">
        <p>{T("about_p1")}</p>
        <p>{T("about_p2")}</p>
        <p>{T("about_p3")}</p>
        <p>{T("about_p4")}</p>
        <ul className="list-none space-y-2 border-t border-[#e5e7eb] pt-4 text-[#6b7280]">
          <li>
            {T("about_support_label")}{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-[#111827] hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </li>
          <li>
            {T("about_b2b_label")}{" "}
            <a href={`mailto:${B2B_EMAIL}`} className="font-medium text-[#111827] hover:underline">
              {B2B_EMAIL}
            </a>
          </li>
        </ul>
        <Link href="/" className="inline-block font-medium text-[#111827] hover:underline">
          {T("page_back_home")}
        </Link>
      </div>
    </div>
  );
}
