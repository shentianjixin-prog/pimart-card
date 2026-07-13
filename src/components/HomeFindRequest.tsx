"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";
import { LINE_CONTACT_URL } from "@/lib/site";

export function HomeFindRequest() {
  const T = useT();

  return (
    <section className="home-find" aria-labelledby="home-find-title">
      <div className="home-find-panel">
        <div className="home-find-copy">
          <p className="home-find-tag">{T("find_tag")}</p>
          <h2 id="home-find-title" className="home-find-title">
            {T("find_title")}
          </h2>
          <p className="home-find-desc">{T("find_desc")}</p>
          <p className="home-find-hint">
            {T("find_hint_pre")}
            <Link href="/account/register" className="home-find-link">
              {T("find_hint_register")}
            </Link>
            {T("find_hint_mid")}
            <strong>{T("find_hint_fields")}</strong>
            {T("find_hint_end")}
          </p>
        </div>
        <div className="home-find-actions">
          <a
            href={LINE_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary home-find-cta rounded-full px-7 text-center"
          >
            {T("find_cta")}
          </a>
          <Link href="/contact" className="btn-secondary home-find-cta rounded-full px-7 text-center">
            {T("find_cta_email")}
          </Link>
        </div>
      </div>
    </section>
  );
}
