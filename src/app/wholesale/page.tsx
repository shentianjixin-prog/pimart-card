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
        <a
          href={`mailto:${B2B_EMAIL}`}
          className="inline-flex min-h-11 items-center font-medium text-[#111827] hover:underline"
        >
          {B2B_EMAIL}
        </a>
        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            {T("contact_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
