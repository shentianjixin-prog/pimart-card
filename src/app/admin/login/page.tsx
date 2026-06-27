"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-24">
      <div className="surface p-6">
        <h1 className="mb-6 text-xl font-bold text-white">管理后台登录</h1>
        <form action={action} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">账号</label>
            <input name="username" type="text" required className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">密码</label>
            <input name="password" type="password" required className="input-field" />
          </div>
          {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
