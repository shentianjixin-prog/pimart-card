"use client";

import Image from "next/image";
import Link from "next/link";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const STACK_STYLES = [
  { rotate: -12, x: -80, y: 20, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #ffffff 100%)" },
  { rotate: -4, x: -28, y: -8, z: 2, bg: "linear-gradient(135deg, #F3EEFF 0%, #ffffff 100%)" },
  { rotate: 0, x: 0, y: 0, z: 3, bg: "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)" },
  { rotate: 6, x: 32, y: -12, z: 2, bg: "linear-gradient(135deg, #FFF0F5 0%, #ffffff 100%)" },
  { rotate: 14, x: 76, y: 24, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #FFF0F5 100%)" },
];

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const stack = products.slice(0, 5);
  while (stack.length < 5) {
    stack.push({
      name: "TCG Box",
      images: "/products/placeholder.svg",
      slug: "#",
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[rgba(17,24,39,0.08)] bg-[#f7f8fa] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#EAF4FF_0%,transparent_50%),radial-gradient(circle_at_80%_30%,#F3EEFF_0%,transparent_45%),radial-gradient(circle_at_50%_90%,#FFF7D6_0%,transparent_40%)]" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-fade-up text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
            Premium TCG Marketplace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            PIMART CARD
          </h1>
          <p className="mt-2 text-lg font-medium text-[#374151] sm:text-xl">
            Global Trading Card Marketplace
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6b7280] lg:mx-0 sm:text-base">
            Japanese &amp; Chinese TCG Sealed Boxes, PSA Cards &amp; Wholesale Supply
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/?sort=newest&inStock=1" className="btn-primary">
              Shop New Arrivals
            </Link>
            <Link href="/contact" className="btn-secondary">
              Wholesale Inquiry
            </Link>
            <Link href="/?q=PSA" className="btn-secondary">
              View PSA Picks
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-[320px] w-full max-w-md items-center justify-center sm:h-[380px]">
          {stack.map((product, i) => {
            const style = STACK_STYLES[i];
            const image = product.images.split(",")[0]?.trim() || "/products/placeholder.svg";
            return (
              <Link
                key={`${product.slug}-${i}`}
                href={product.slug === "#" ? "/" : `/products/${product.slug}`}
                className="hero-stack-card group absolute w-[118px] transition duration-500 sm:w-[160px]"
                style={{
                  zIndex: style.z,
                  ["--stack-x" as string]: `${style.x}`,
                  ["--stack-y" as string]: `${style.y}`,
                  ["--stack-r" as string]: `${style.rotate}`,
                }}
              >
                <div
                  className="overflow-hidden rounded-[20px] border border-[rgba(17,24,39,0.08)] p-3 shadow-[0_20px_50px_rgba(17,24,39,0.08)] transition duration-500 group-hover:-translate-y-2 group-hover:rotate-0"
                  style={{ background: style.bg }}
                >
                  <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[14px] bg-white">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      unoptimized={image.endsWith(".svg")}
                      sizes="160px"
                      className="object-contain p-2 transition duration-500 group-hover:scale-105"
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
