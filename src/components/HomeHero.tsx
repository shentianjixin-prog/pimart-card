"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/lang-context";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const CAROUSEL_BACKGROUNDS = [
  "linear-gradient(135deg, #EAF4FF 0%, #ffffff 100%)",
  "linear-gradient(135deg, #F3EEFF 0%, #ffffff 100%)",
  "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)",
  "linear-gradient(135deg, #FFF0F5 0%, #ffffff 100%)",
  "linear-gradient(135deg, #F0F9FF 0%, #ffffff 100%)",
];

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const T = useT();
  const slides = products.slice(0, 5);
  while (slides.length < 5) {
    slides.push({
      name: "TCG Box",
      images: "/products/placeholder.svg",
      slug: "#",
    });
  }

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-panel relative overflow-hidden rounded-[28px] border border-[rgba(17,24,39,0.08)] px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,#F0F9FF_0%,transparent_52%),radial-gradient(circle_at_82%_28%,#F8F5FF_0%,transparent_48%),radial-gradient(circle_at_50%_92%,#FFF7D6_0%,transparent_42%)]" />

      <div className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="animate-fade-up text-center lg:text-left">
          <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            PIMART CARD
          </h1>

          <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="trust-badge">
              <span aria-hidden>🌍</span>
              {T("hero_trust_global")}
            </span>
            <span className="trust-badge">
              <span aria-hidden>✔️</span>
              {T("hero_trust_auth")}
            </span>
          </div>

          <p className="mt-4 text-lg font-medium tracking-tight text-[#374151] sm:text-xl">
            Global Trading Card Marketplace
          </p>
          <p className="hero-desc mx-auto mt-4 max-w-xl leading-relaxed lg:mx-0">
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

        <div className="hero-carousel relative mx-auto h-[360px] w-full max-w-sm sm:h-[420px] sm:max-w-md">
          {slides.map((product, i) => {
            const image = product.images.split(",")[0]?.trim() || "/products/placeholder.svg";
            const isActive = i === active;
            return (
              <Link
                key={`${product.slug}-${i}`}
                href={product.slug === "#" ? "/" : `/products/${product.slug}`}
                className={`hero-carousel-slide absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500 ease-out ${
                  isActive
                    ? "pointer-events-auto z-10 translate-x-0 opacity-100"
                    : "pointer-events-none z-0 translate-x-6 opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <div
                  className="hero-carousel-card w-full max-w-[240px] overflow-hidden rounded-[24px] border border-[rgba(17,24,39,0.08)] p-4 shadow-[0_24px_60px_rgba(17,24,39,0.1)] sm:max-w-[280px]"
                  style={{ background: CAROUSEL_BACKGROUNDS[i % CAROUSEL_BACKGROUNDS.length] }}
                >
                  <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[18px] bg-white">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      unoptimized={image.endsWith(".svg")}
                      sizes="280px"
                      className="object-contain p-3"
                      priority={i === 0}
                    />
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 max-w-[260px] text-center text-sm font-medium text-[#111827] sm:text-base">
                  {product.name}
                </p>
              </Link>
            );
          })}

          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 pb-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`touch-target h-2.5 min-h-0 min-w-0 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[#111827]" : "w-2.5 bg-[#d1d5db] hover:bg-[#9ca3af]"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
