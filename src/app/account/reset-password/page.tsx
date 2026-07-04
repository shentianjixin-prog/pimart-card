import Link from "next/link";
import { cookies } from "next/headers";
import { ResetPasswordForm } from "@/components/account/MemberAuthForm";
import { resolveLang, t } from "@/lib/translations";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <h1 className="section-title">{T("auth_reset_title")}</h1>
        <p className="mt-4 text-sm text-red-600">{T("auth_err_reset_invalid")}</p>
        <Link href="/account/forgot-password" className="btn-primary mt-6 inline-flex min-h-10 items-center rounded-full px-5 text-sm">
          {T("auth_forgot_title")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="section-title">{T("auth_reset_title")}</h1>
      <p className="mt-2 text-sm text-[#6b7280]">{T("auth_reset_sub")}</p>
      <div className="mt-8 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
