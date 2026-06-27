"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

export function HomeHero() {
  const T = useT();

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0e1f] via-[#0d1530] to-[#080c1a] border border-white/10">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-2xl" />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        {/* 品牌标签 */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {T("brand_hero_tag")}
        </p>

        {/* 品牌标题 */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          <span className="gradient-text">PIMART</span>{" "}
          <span className="text-white">CARD</span>
        </h1>

        {/* 标语 */}
        <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
          {T("brand_tagline")}
        </p>

        {/* CTA 按钮 */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/?category=%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%8E%9F%E7%9B%92"
            className="btn-primary text-sm"
          >
            {T("brand_cta_pokemon")}
          </Link>
          <Link
            href="/contact"
            className="btn-secondary text-sm"
          >
            {T("brand_cta_wholesale")}
          </Link>
          <Link
            href="/?sort=newest"
            className="btn-secondary text-sm"
          >
            {T("brand_cta_new")}
          </Link>
        </div>

        {/* 信任标签 */}
        <div className="mt-7 flex flex-wrap gap-2">
          {[
            { icon: "🛡️", key: "trust_auth_title" },
            { icon: "🇯🇵", key: "trust_japan_title" },
            { icon: "✈️", key: "trust_world_title" },
            { icon: "🔒", key: "trust_pay_title" },
          ].map((b) => (
            <span
              key={b.key}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300"
            >
              <span>{b.icon}</span>
              {T(b.key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
