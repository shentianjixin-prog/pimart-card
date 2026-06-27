"use client";

import { useT } from "@/lib/lang-context";

const REGIONS = [
  { key: "region_jp", x: "78%", y: "42%" },
  { key: "region_cn", x: "68%", y: "38%" },
  { key: "region_us", x: "22%", y: "36%" },
  { key: "region_sg", x: "72%", y: "58%" },
  { key: "region_my", x: "70%", y: "52%" },
  { key: "region_th", x: "74%", y: "48%" },
] as const;

export function HomeWorldTrust() {
  const T = useT();

  return (
    <section className="home-world mb-10 pb-10 sm:mb-14 sm:pb-14 lg:mb-16 lg:pb-16">
      <div className="home-world-panel">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="section-title">{T("world_title")}</h2>
          <p className="section-subtitle mx-auto max-w-2xl">{T("world_subtitle")}</p>
        </div>

        <div className="home-world-map relative mx-auto aspect-[2/1] max-w-3xl overflow-hidden rounded-[32px] border border-[rgba(15,23,42,0.08)] bg-gradient-to-b from-[#F8FAFC] to-[#FAFAFA]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.12) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-[12%] rounded-[40%] border border-[rgba(15,23,42,0.06)] bg-white/40" />

          {REGIONS.map((r) => (
            <div
              key={r.key}
              className="home-world-dot absolute"
              style={{ left: r.x, top: r.y }}
            >
              <span className="home-world-pulse" />
              <span className="home-world-label">{T(r.key)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:hidden">
          {REGIONS.map((r) => (
            <span
              key={r.key}
              className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-3 py-1.5 text-xs font-medium text-[#374151]"
            >
              {T(r.key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
