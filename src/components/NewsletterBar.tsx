"use client";

import { useState } from "react";

export function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <div className="border-t border-white/10 bg-white/[0.02] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {done ? (
          <p className="text-center text-sm text-cyan-300">
            ✅ 已订阅，感谢！我们将第一时间通知您新品预售信息。
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <p className="text-sm font-medium text-gray-300">
              🔔 订阅新品通知，第一时间获取预售信息
            </p>
            <input
              type="email"
              placeholder="输入您的邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field w-full max-w-xs py-1.5"
            />
            <button type="submit" className="btn-primary shrink-0 py-1.5">
              订阅
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
