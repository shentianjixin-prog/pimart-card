import Link from "next/link";

export default function NotFound() {
  return (
    <div className="state-page">
      <p className="state-page-code">404</p>
      <h1>This card has left the collection.</h1>
      <p>The product or page may have moved, sold out, or is no longer available.</p>
      <div className="state-page-actions">
        <Link href="/?stock=instock" className="btn-primary">Browse in-stock cards</Link>
        <Link href="/" className="btn-secondary">Back home</Link>
      </div>
    </div>
  );
}
