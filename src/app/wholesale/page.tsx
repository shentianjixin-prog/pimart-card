import Link from "next/link";
import { cookies } from "next/headers";
import { B2B_EMAIL } from "@/lib/site";
import { resolveLang, t } from "@/lib/translations";

export default async function WholesalePage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">{T("footer_wholesale")}</h1>
      <div className="surface space-y-4 p-6 text-sm text-[#374151]">
        <p className="text-[#6b7280]">{T("wholesale_contact_only")}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <a
            href={`mailto:${B2B_EMAIL}`}
            className="inline-flex min-h-11 items-center font-medium text-[#111827] hover:underline"
          >
            {B2B_EMAIL}
          </a>
          <Link href="/wholesale-terms" className="font-medium text-[#111827] hover:underline">
            查看批发合作条款
          </Link>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4 text-xs leading-relaxed text-[#6b7280]">
          批发报价以书面确认为准；大货、预售、锁货订单原则上不支持个人原因取消。海外税费、清关责任和目的国合规要求请在询价前确认。
        </div>
        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {T("contact_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}