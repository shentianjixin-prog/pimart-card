"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-context";

const STATS = [
  { value: "20+", labelKey: "stats_countries" },
  { value: "10000+", labelKey: "stats_orders" },
  { value: "5000+", labelKey: "stats_collectors" },
  { value: "99.8%", labelKey: "stats_rating" },
] as const;

export function HomeStats() {
  const T = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="home-stats">
      <div className={`home-stats-grid ${visible ? "is-visible" : ""}`}>
        {STATS.map((s) => (
          <div key={s.labelKey} className="home-stat-item">
            <p className="home-stat-value">{s.value}</p>
            <p className="home-stat-label">{T(s.labelKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
