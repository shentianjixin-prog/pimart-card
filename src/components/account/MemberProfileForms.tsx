"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  updateProfileAction,
  type AuthState,
} from "@/app/account/actions";
import { useT } from "@/lib/lang-context";

const INPUT =
  "w-full rounded-[14px] border border-[rgba(17,24,39,0.08)] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#111827]/10";

function FormFeedback({ state }: { state: AuthState }) {
  const T = useT();
  if (state?.error) {
    return <p className="text-sm text-red-600">{T(state.error)}</p>;
  }
  if (state?.success) {
    return <p className="text-sm text-emerald-600">{T(state.success)}</p>;
  }
  return null;
}

type ProfileDefaults = {
  name: string;
  nameKana: string;
  email: string;
  phone: string;
};

export function ProfileEditForm({ defaults }: { defaults: ProfileDefaults }) {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(updateProfileAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_name")}</label>
        <input name="name" type="text" required defaultValue={defaults.name} autoComplete="name" className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_name_kana")}</label>
        <input name="nameKana" type="text" defaultValue={defaults.nameKana} autoComplete="off" className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_email")}</label>
        <input
          type="email"
          value={defaults.email}
          readOnly
          className={`${INPUT} cursor-not-allowed bg-[#f9fafb] text-[#6b7280]`}
        />
        <p className="mt-1 text-xs text-[#9ca3af]">{T("auth_email_readonly")}</p>
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_phone")}</label>
        <input name="phone" type="tel" defaultValue={defaults.phone} autoComplete="tel" className={INPUT} />
      </div>
      <FormFeedback state={state} />
      <button type="submit" disabled={pending} className="btn-primary min-h-10 rounded-full px-5 text-sm">
        {pending ? "..." : T("auth_save_profile")}
      </button>
    </form>
  );
}

export function PasswordChangeForm() {
  const T = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(changePasswordAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_current_password")}</label>
        <input name="currentPassword" type="password" required autoComplete="current-password" className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_new_password")}</label>
        <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[#374151]">{T("auth_password_confirm")}</label>
        <input name="newPasswordConfirm" type="password" required minLength={8} autoComplete="new-password" className={INPUT} />
      </div>
      <FormFeedback state={state} />
      <button type="submit" disabled={pending} className="btn-secondary min-h-10 rounded-full px-5 text-sm">
        {pending ? "..." : T("auth_change_password")}
      </button>
    </form>
  );
}
