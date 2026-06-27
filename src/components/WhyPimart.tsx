const REASONS = [
  {
    title: "Authentic Guarantee",
    desc: "All products sourced through verified channels with traceable supply.",
    tint: "#EAF4FF",
  },
  {
    title: "Ships from Japan",
    desc: "Carefully packed and dispatched from Japan with reliable handling.",
    tint: "#F3EEFF",
  },
  {
    title: "Worldwide Shipping",
    desc: "International delivery support for collectors and resellers worldwide.",
    tint: "#FFF7D6",
  },
  {
    title: "Secure Payment",
    desc: "Stripe-powered checkout with encrypted payment processing.",
    tint: "#FFF0F5",
  },
];

export function WhyPimart() {
  return (
    <section className="rounded-[28px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] px-6 py-12 sm:px-10 sm:py-14">
      <div className="mb-8 text-center">
        <h2 className="section-title">Why PIMART CARD</h2>
        <p className="section-subtitle">Trusted supply for sealed boxes, graded cards, and wholesale buyers.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((item) => (
          <div
            key={item.title}
            className="rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)]"
            style={{ background: `linear-gradient(180deg, ${item.tint} 0%, #ffffff 70%)` }}
          >
            <h3 className="text-base font-semibold text-[#111827]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
