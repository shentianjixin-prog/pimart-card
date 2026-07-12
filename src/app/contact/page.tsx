import Link from "next/link";
import { cookies } from "next/headers";
import { B2B_EMAIL, LINE_CONTACT_URL, SUPPORT_EMAIL } from "@/lib/site";
import { resolveLang, t } from "@/lib/translations";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{T("footer_contact")}</h1>
      <div className="surface space-y-5 p-6 text-sm text-[#374151]">
        <p className="text-[#6b7280]">{T("contact_desc")}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={LINE_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="buyback-line-btn flex-1 text-center"
          >
            {T("contact_line_btn")}
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-medium"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div id="b2b" className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
          <p className="font-medium text-[#111827]">{T("contact_b2b_title")}</p>
          <p className="mt-1 text-[#6b7280]">{T("contact_b2b_desc")}</p>
          <a
            href={`mailto:${B2B_EMAIL}`}
            className="mt-3 inline-flex min-h-11 items-center font-medium text-[#111827] hover:underline"
          >
            {B2B_EMAIL}
          </a>
        </div>

        <ul className="list-disc space-y-2 pl-5 text-[#6b7280]">
          <li>{T("contact_hours")}</li>
          <li>{T("contact_reply")}</li>
          <li>
            {T("contact_support_label")}：{SUPPORT_EMAIL}
          </li>
          <li>
            {T("contact_b2b_label")}：{B2B_EMAIL}
          </li>
        </ul>

        <p className="text-xs text-[#9ca3af]">{T("contact_line_hint")}</p>

        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {T("contact_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
