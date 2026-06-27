"use client";

import { useState } from "react";
import { useT } from "@/lib/lang-context";

export function NewsletterBar() {
  const T = useT();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <div className="border-t border-[rgba(17,24,39,0.08)] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {done ? (
          <p className="text-center text-sm font-medium text-[#111827]">
            {T("newsletter_done")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5 rounded-[24px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] p-6 sm:flex-row sm:justify-between sm:p-8"
          >
            <div>
              <p className="text-lg font-semibold text-[#111827]">{T("newsletter_title")}</p>
              <p className="mt-1 text-sm text-[#6b7280]">{T("newsletter_sub")}</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder={T("newsletter_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary shrink-0 px-6">
                {T("newsletter_btn")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
