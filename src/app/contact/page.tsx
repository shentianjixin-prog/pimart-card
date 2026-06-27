import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="section-title mb-6">Wholesale &amp; Contact</h1>
      <div className="surface space-y-4 p-6 text-sm text-[#374151]">
        <p className="text-[#6b7280]">
          For product inquiries, order support, or wholesale supply requests, reach out through:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-[#6b7280]">
          <li>Email: support@pimart-card.com</li>
          <li>Hours: Mon–Fri 10:00–18:00 (JST)</li>
          <li>We typically respond within 1–2 business days</li>
        </ul>
        <p className="pt-2">
          <Link href="/" className="font-medium text-[#111827] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
