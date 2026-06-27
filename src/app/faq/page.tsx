import Link from "next/link";
import { cookies } from "next/headers";
import { t, resolveLang } from "@/lib/translations";

const FAQ_KEYS = ["faq_q1", "faq_a1", "faq_q2", "faq_a2", "faq_q3", "faq_a3"] as const;

export default async function FaqPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  return (
    <div className="section-tone-sky mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="section-title">{T("footer_faq")}</h1>
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface p-6">
            <h2 className="text-base font-semibold text-[#111827]">{T(FAQ_KEYS[i * 2])}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{T(FAQ_KEYS[i * 2 + 1])}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[#6b7280]">
        {T("faq_contact_pre")}
        <Link href="/contact" className="mx-1 font-medium text-[#111827] hover:underline">
          {T("footer_contact")}
        </Link>
      </p>
    </div>
  );
}
