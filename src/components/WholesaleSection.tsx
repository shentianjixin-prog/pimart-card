"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function WholesaleSection() {
  const T = useT();
  return (
    <section className="my-16 border border-[var(--border)] bg-[#080808]">
      <div className="grid lg:grid-cols-[1fr_auto]">
        <div className="border-b border-[var(--border-subtle)] px-8 py-10 lg:border-b-0 lg:border-r">
          <p className="font-display text-5xl font-light text-[var(--gold)] opacity-30">B2B</p>
          <h2 className="font-display mt-2 text-2xl font-light text-[var(--ivory)] sm:text-3xl">
            {T("wholesale_title")}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-[1.9] text-neutral-500">{T("wholesale_desc")}</p>
          <ul className="mt-6 space-y-2">
            {(["wholesale_f1", "wholesale_f2", "wholesale_f3"] as const).map((k) => (
              <li key={k} className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-neutral-400">
                <span className="h-px w-6 bg-[var(--gold)]" />
                {T(k)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-10">
          <Link href="/contact" className="btn-primary min-w-[180px]">
            {T("wholesale_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
