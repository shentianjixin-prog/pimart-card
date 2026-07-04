"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
  type AuthState,
} from "@/app/account/actions";
import { useT } from "@/lib/lang-context";
import type { Lang } from "@/lib/translations";

const INPUT =
  "w-full rounded-[14px] border border-[rgba(17,24,39,0.08)] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#111827]/10";

function AuthShell({
  title,
  subtitle,
  children,
  altHref,
  altKey,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altHref: string;
  altKey: string;
}) {
  const T = useT();
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="section-title">{title}</h1>
      <p className="mt-2 text-sm text-[#6b7280]">{subtitle}</p>
      <div className="mt-8 rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]">
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-[#6b7280]">
        <Link href={altHref} className="font-medium text-[#111827] hover:underline">
          {T(altKey)}
        </Link>
      </p>
    </div>
  );
}

function AuthFeedback({ state }: { state: AuthState }) {
  const T = useT();
  if (state?.error) return <p className="text-sm text-red-600">{T(state.error)}</p>;
  if (state?.success) return <p className="text-sm text-emerald-600">{T(state.success)}</p>;
  return null;
}

export function LoginForm() {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <AuthShell
      title={T("auth_login_title")}
      subtitle={T("auth_login_sub")}
      altHref="/account/register"
      altKey="auth_go_register"
    >
      <form action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_email")}</label>
          <input name="email" type="email" required autoComplete="email" className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_password")}</label>
          <input name="password" type="password" required autoComplete="current-password" className={INPUT} />
        </div>
        <AuthFeedback state={state} />
        <button type="submit" disabled={pending} className="btn-primary min-h-11 w-full rounded-full">
          {pending ? "..." : T("auth_login_btn")}
        </button>
        <p className="text-center text-xs text-[#9ca3af]">
          <Link href="/account/forgot-password" className="hover:text-[#374151] hover:underline">
            {T("auth_forgot_password")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterForm() {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, undefined);

  return (
    <AuthShell
      title={T("auth_register_title")}
      subtitle={T("auth_register_sub")}
      altHref="/account/login"
      altKey="auth_go_login"
    >
      <form action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_name")}</label>
          <input name="name" type="text" required autoComplete="name" className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_name_kana")}</label>
          <input name="nameKana" type="text" autoComplete="off" className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_email")}</label>
          <input name="email" type="email" required autoComplete="email" className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_phone")}</label>
          <input name="phone" type="tel" autoComplete="tel" className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_password")}</label>
          <input name="password" type="password" required autoComplete="new-password" minLength={8} className={INPUT} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#374151]">{T("auth_password_confirm")}</label>
          <input name="passwordConfirm" type="password" required autoComplete="new-password" minLength={8} className={INPUT} />
        </div>
        <AuthFeedback state={state} />
        <button type="submit" disabled={pending} className="btn-primary min-h-11 w-full rounded-full">
          {pending ? "..." : T("auth_register_btn")}
        </button>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordForm({ lang }: { lang: Lang }) {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(forgotPasswordAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_email")}</label>
        <input name="email" type="email" required autoComplete="email" className={INPUT} />
      </div>
      <AuthFeedback state={state} />
      <button type="submit" disabled={pending} className="btn-primary min-h-11 w-full rounded-full">
        {pending ? "..." : T("auth_reset_send")}
      </button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(resetPasswordAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_new_password")}</label>
        <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_password_confirm")}</label>
        <input name="newPasswordConfirm" type="password" required minLength={8} autoComplete="new-password" className={INPUT} />
      </div>
      <AuthFeedback state={state} />
      <button type="submit" disabled={pending} className="btn-primary min-h-11 w-full rounded-full">
        {pending ? "..." : T("auth_reset_confirm")}
      </button>
    </form>
  );
}
