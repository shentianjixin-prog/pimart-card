"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="state-page" role="alert">
      <p className="state-page-code">RETRY</p>
      <h1>Something interrupted the connection.</h1>
      <p>Your cart is still stored on this device. Please retry the page.</p>
      <button type="button" onClick={reset} className="btn-primary">Try again</button>
    </div>
  );
}
