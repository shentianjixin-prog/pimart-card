import Link from "next/link";
import { cookies } from "next/headers";
import { ForgotPasswordForm } from "@/components/account/MemberAuthForm";
import { LINE_CONTACT_URL, SUPPORT_EMAIL } from "@/lib/site";
import { isEmailConfigured } from "@/lib/email";
import { resolveLang, t } from "@/lib/translations";

export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);
  const emailReady = isEmailConfigured();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="section-title">{T("auth_forgot_title")}</h1>
      <p className="mt-2 text-sm text-[#6b7280]">{T("auth_forgot_sub")}</p>

      <div className="mt-8 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]">
        {emailReady ? (
          <ForgotPasswordForm lang={lang} />
        ) : (
          <div className="space-y-4 text-sm text-[#6b7280]">
            <p>{T("auth_err_email_not_configured")}</p>
            <a href={LINE_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="buyback-line-btn w-full">
              {T("contact_line_btn")}
            </a>
            <p>
              {T("contact_email_label")}:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-[#111827] hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-[#6b7280]">
        <Link href="/account/login" className="font-medium text-[#111827] hover:underline">
          {T("auth_go_login")}
        </Link>
      </p>
    </div>
  );
}
