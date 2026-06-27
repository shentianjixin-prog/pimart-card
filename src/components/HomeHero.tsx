"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/lang-context";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const STACK_STYLES = [
  { rotate: -14, x: -84, y: 24, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #ffffff 100%)" },
  { rotate: -5, x: -30, y: -6, z: 2, bg: "linear-gradient(135deg, #F3EEFF 0%, #ffffff 100%)" },
  { rotate: 0, x: 0, y: 0, z: 3, bg: "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)" },
  { rotate: 7, x: 34, y: -14, z: 2, bg: "linear-gradient(135deg, #FFF0F5 0%, #ffffff 100%)" },
  { rotate: 15, x: 80, y: 26, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #FFF0F5 100%)" },
];

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const T = useT();
  const stack = products.slice(0, 5);
  while (stack.length < 5) {
    stack.push({
      name: "TCG Box",
      images: "/products/placeholder.svg",
      slug: "#",
    });
  }

  return (
    <section className="hero-panel relative overflow-hidden rounded-[28px] border border-[rgba(17,24,39,0.08)] px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,#F0F9FF_0%,transparent_52%),radial-gradient(circle_at_82%_28%,#F8F5FF_0%,transparent_48%),radial-gradient(circle_at_50%_92%,#FFF7D6_0%,transparent_42%)]" />

      <div className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="animate-fade-up text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
            {T("hero_tag")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            PIMART CARD
          </h1>
          <p className="mt-3 text-lg font-medium tracking-tight text-[#374151] sm:text-xl">
            Global Trading Card Marketplace
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#6b7280] lg:mx-0 sm:text-base">
            {T("hero_desc")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/?sort=newest&inStock=1" className="btn-primary">
              {T("hero_cta_new")}
            </Link>
            <Link href="/contact" className="btn-secondary">
              {T("hero_cta_wholesale")}
            </Link>
            <Link href="/?q=PSA" className="btn-secondary">
              {T("hero_cta_psa")}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center sm:h-[400px]">
          {stack.map((product, i) => {
            const style = STACK_STYLES[i];
            const image = product.images.split(",")[0]?.trim() || "/products/placeholder.svg";
            return (
              <Link
                key={`${product.slug}-${i}`}
                href={product.slug === "#" ? "/" : `/products/${product.slug}`}
                className="hero-stack-card group absolute w-[118px] sm:w-[168px]"
                style={{
                  zIndex: style.z,
                  ["--stack-x" as string]: `${style.x}`,
                  ["--stack-y" as string]: `${style.y}`,
                  ["--stack-r" as string]: `${style.rotate}`,
                }}
              >
                <div
                  className="hero-stack-inner overflow-hidden rounded-[20px] border border-[rgba(17,24,39,0.08)] p-3"
                  style={{ background: style.bg }}
                >
                  <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[14px] bg-white">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      unoptimized={image.endsWith(".svg")}
                      sizes="168px"
                      className="object-contain p-2 transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
