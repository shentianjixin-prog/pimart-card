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
    <div className="border-t border-[rgba(17,24,39,0.08)] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {done ? (
          <p className="text-center text-sm font-medium text-[#111827]">
            Subscribed — thank you for joining PIMART CARD.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5 rounded-[24px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] p-6 sm:flex-row sm:justify-between sm:p-8"
          >
            <div>
              <p className="text-lg font-semibold text-[#111827]">Stay updated</p>
              <p className="mt-1 text-sm text-[#6b7280]">New arrivals, PSA drops, and wholesale updates.</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary shrink-0 px-6">
                Subscribe
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
