"use client";

import { useT } from "@/lib/lang-context";

const FEATURES = [
  { titleKey: "trusted_f1_title", descKey: "trusted_f1_desc" },
  { titleKey: "trusted_f2_title", descKey: "trusted_f2_desc" },
  { titleKey: "trusted_f3_title", descKey: "trusted_f3_desc" },
  { titleKey: "trusted_f4_title", descKey: "trusted_f4_desc" },
] as const;

const INLINE_STATS = [
  { value: "10000+", labelKey: "stats_orders" },
  { value: "5000+", labelKey: "stats_collectors" },
  { value: "99.8%", labelKey: "stats_rating" },
] as const;

export function TrustedFeatures() {
  const T = useT();

  return (
    <section className="trusted-features">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="trusted-section-title">{T("trusted_title")}</h2>
        <p className="trusted-section-subtitle mx-auto max-w-xl">{T("trusted_subtitle")}</p>
        <div className="trusted-inline-stats">
          {INLINE_STATS.map((s) => (
            <div key={s.labelKey} className="trusted-inline-stat">
              <p className="trusted-inline-stat-value">{s.value}</p>
              <p className="trusted-inline-stat-label">{T(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="trusted-features-track">
        {FEATURES.map((f) => (
          <div key={f.titleKey} className="trusted-feature-item">
            <h3 className="trusted-feature-title">{T(f.titleKey)}</h3>
            <p className="trusted-feature-desc">{T(f.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
