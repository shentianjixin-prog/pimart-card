"use client";

import { useT } from "@/lib/lang-context";

const FEATURES = [
  { titleKey: "trusted_f1_title", descKey: "trusted_f1_desc" },
  { titleKey: "trusted_f2_title", descKey: "trusted_f2_desc" },
  { titleKey: "trusted_f3_title", descKey: "trusted_f3_desc" },
  { titleKey: "trusted_f4_title", descKey: "trusted_f4_desc" },
] as const;

export function TrustedFeatures() {
  const T = useT();

  return (
    <section className="trusted-features mb-10 sm:mb-14 lg:mb-16">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="trusted-section-title">{T("trusted_title")}</h2>
        <p className="trusted-section-subtitle mx-auto max-w-2xl">{T("trusted_subtitle")}</p>
      </div>
      <div className="trusted-features-track">
        {FEATURES.map((f) => (
          <div key={f.titleKey} className="trusted-feature-card">
            <h3 className="trusted-feature-title">{T(f.titleKey)}</h3>
            <p className="trusted-feature-desc">{T(f.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
