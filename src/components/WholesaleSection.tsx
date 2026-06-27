"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function WholesaleSection() {
  const T = useT();
  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/30 to-indigo-900/30">
      <div className="px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">B2B</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">{T("wholesale_title")}</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-400">{T("wholesale_desc")}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {(["wholesale_f1", "wholesale_f2", "wholesale_f3"] as const).map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-sm text-gray-300">
                  <span className="text-violet-400">✓</span>
                  {T(k)}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/contact"
            className="btn-primary shrink-0 text-sm sm:text-base"
          >
            {T("wholesale_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
