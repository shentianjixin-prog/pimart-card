"use client";

import { useT } from "@/lib/lang-context";

const ITEMS = [
  "announce_sv",
  "announce_op",
  "announce_psa",
  "announce_b2b",
] as const;

export function HomeAnnounceBar() {
  const T = useT();

  return (
    <section className="home-announce mb-10 sm:mb-14">
      <div className="home-announce-inner">
        <span className="home-announce-label">{T("announce_title")}</span>
        <div className="home-announce-scroll">
          <div className="home-announce-items">
            {ITEMS.map((key) => (
              <span key={key} className="home-announce-item">
                {T(key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
