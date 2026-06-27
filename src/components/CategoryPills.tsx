import Link from "next/link";

const CATEGORIES = [
  { label: "Pokémon", href: "/?category=宝可梦原盒", tint: "#EAF4FF" },
  { label: "One Piece", href: "/?q=One%20Piece", tint: "#F3EEFF" },
  { label: "Dragon Ball", href: "/?q=Dragon%20Ball", tint: "#FFF7D6" },
  { label: "PSA", href: "/?q=PSA", tint: "#FFF0F5" },
  { label: "Sealed Boxes", href: "/?inStock=1", tint: "#EAF4FF" },
  { label: "Wholesale", href: "/contact", tint: "#F3EEFF" },
];

export function CategoryPills() {
  return (
    <section className="py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="category-pill shrink-0"
            style={{ background: `linear-gradient(180deg, ${cat.tint} 0%, #ffffff 100%)` }}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
