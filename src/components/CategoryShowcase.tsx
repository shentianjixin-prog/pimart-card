"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/lang-context";

const CATEGORIES = [
  {
    key: "cat_pokemon",
    href: "/?category=宝可梦原盒",
    image: "/products/cs65-box.png",
    tint: "#F0F9FF",
    accent: "#EAF4FF",
  },
  {
    key: "cat_one_piece",
    href: "/?q=One%20Piece",
    image: "/products/ylsc-collect-box.png",
    tint: "#F8F5FF",
    accent: "#F3EEFF",
  },
  {
    key: "cat_dragon_ball",
    href: "/?q=Dragon%20Ball",
    image: "/products/cbb3c-box.png",
    tint: "#FFF7ED",
    accent: "#FFF7D6",
  },
  {
    key: "cat_sealed",
    href: "/?inStock=1",
    image: "/products/cs4a-box.png",
    tint: "#F8FAFC",
    accent: "#EAF4FF",
  },
  {
    key: "cat_psa",
    href: "/?stock=preorder",
    image: "/products/cs4b-box.png",
    tint: "#FFF7ED",
    accent: "#FFF7D6",
  },
  {
    key: "cat_wholesale",
    href: "/wholesale",
    image: null,
    tint: "#F8F5FF",
    accent: "#EDE9FE",
  },
] as const;

export function CategoryShowcase() {
  const T = useT();

  return (
    <section className="section-block py-12 sm:py-16">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="section-title">{T("showcase_title")}</h2>
        <p className="section-subtitle">{T("showcase_subtitle")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={cat.href}
            className="category-showcase-card group"
            style={{
              background: `linear-gradient(160deg, ${cat.tint} 0%, #ffffff 55%, ${cat.accent} 100%)`,
            }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-white/60">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  className="object-contain p-4 transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl opacity-40">📦</div>
              )}
            </div>
            <p className="mt-4 text-sm font-semibold text-[#111827] sm:text-base">{T(cat.key)}</p>
            <p className="mt-1 text-xs text-[#6b7280]">{T("showcase_explore")}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
