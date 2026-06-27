import Link from "next/link";
import { cookies } from "next/headers";
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
        <Link href="/" className="inline-block font-medium text-[#111827] hover:underline">
          {T("page_back_home")}
        </Link>
      </div>
    </div>
  );
}
