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
    <div className="border-t border-[var(--border-subtle)] bg-[#080808] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {done ? (
          <p className="text-center font-display text-sm text-[var(--gold)]">
            已订阅 — 感谢信任
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between"
          >
            <p className="font-display text-lg font-light text-[var(--ivory)]">
              订阅新品与预售通知
            </p>
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field flex-1 py-2"
              />
              <button type="submit" className="btn-primary shrink-0 px-8">
                订阅
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
