"use client";

import Link from "next/link";
import { useT } from "@/lib/lang-context";

const CATEGORIES = [
  { key: "cat_pokemon", href: "/?category=宝可梦原盒", tint: "#EAF4FF" },
  { key: "cat_one_piece", href: "/?q=One%20Piece", tint: "#F3EEFF" },
  { key: "cat_dragon_ball", href: "/?q=Dragon%20Ball", tint: "#FFF7D6" },
  { key: "cat_sealed", href: "/?inStock=1", tint: "#EAF4FF" },
  { key: "cat_psa", href: "/?stock=preorder", tint: "#FFF7ED" },
  { key: "cat_wholesale", href: "/wholesale", tint: "#F3EEFF" },
] as const;

export function CategoryPills() {
  const T = useT();

  return (
    <section className="py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={cat.href}
            className="category-pill shrink-0"
            style={{ background: `linear-gradient(180deg, ${cat.tint} 0%, #ffffff 100%)` }}
          >
            {T(cat.key)}
          </Link>
        ))}
      </div>
    </section>
  );
}
