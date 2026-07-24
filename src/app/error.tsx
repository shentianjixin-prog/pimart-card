"use client";

import { useT } from "@/lib/lang-context";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const T = useT();
  return (
    <div className="state-page" role="alert">
      <p className="state-page-code">RETRY</p>
      <h1>{T("status_error_title")}</h1>
      <p>{T("cart_network_error")}</p>
      <button type="button" onClick={reset} className="btn-primary">
        {T("status_error_retry")}
      </button>
    </div>
  );
}
