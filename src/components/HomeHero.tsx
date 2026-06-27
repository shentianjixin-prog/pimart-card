"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-context";
import { PimartLogo } from "@/components/PimartLogo";
import { HeroB2BVisual, HeroBrandVisual, HeroPsaVisual } from "@/components/home/HeroVisuals";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const SLIDE_COUNT = 3;
const AUTOPLAY_MS = 10000;
const TRANSITION_MS = 600;

const SLIDE_GRADIENTS = [
  "radial-gradient(circle at 12% 20%, #F0F9FF 0%, transparent 55%), radial-gradient(circle at 88% 25%, #F8F5FF 0%, transparent 50%), radial-gradient(circle at 50% 95%, #FFF7D6 0%, transparent 45%)",
  "radial-gradient(circle at 20% 30%, #FFF0F5 0%, transparent 52%), radial-gradient(circle at 80% 20%, #EAF4FF 0%, transparent 48%)",
  "radial-gradient(circle at 15% 70%, #FFF7D6 0%, transparent 50%), radial-gradient(circle at 85% 35%, #F3EEFF 0%, transparent 45%)",
];

type SlideConfig = {
  id: number;
  brand?: boolean;
  titleKey: string;
  subtitleKey: string;
  descKey: string;
  ctas: { key: string; href: string; primary?: boolean }[];
  visual: "brand" | "psa" | "b2b";
};

const SLIDES: SlideConfig[] = [
  {
    id: 0,
    brand: true,
    titleKey: "hero_v2_s1_title",
    subtitleKey: "hero_v2_s1_sub",
    descKey: "hero_v2_s1_desc",
    ctas: [
      { key: "hero_v2_cta_new", href: "/?sort=newest&stock=instock", primary: true },
      { key: "hero_v2_cta_psa", href: "/?type=psa" },
    ],
    visual: "brand",
  },
  {
    id: 1,
    titleKey: "hero_v2_s2_title",
    subtitleKey: "hero_v2_s2_sub",
    descKey: "hero_v2_s2_desc",
    ctas: [
      { key: "hero_v2_cta_psa", href: "/?type=psa", primary: true },
      { key: "hero_v2_cta_contact", href: "/contact" },
    ],
    visual: "psa",
  },
  {
    id: 2,
    titleKey: "hero_v2_s3_title",
    subtitleKey: "hero_v2_s3_sub",
    descKey: "hero_v2_s3_desc",
    ctas: [
      { key: "hero_v2_cta_quote", href: "/contact", primary: true },
      { key: "hero_v2_cta_wholesale", href: "/contact" },
    ],
    visual: "b2b",
  },
];

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const T = useT();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);

  const goTo = useCallback((index: number) => {
    setActive(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || isDragging) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, isDragging, goNext]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -50) goNext();
    else if (dragOffset > 50) goPrev();
    setDragOffset(0);
  }

  return (
    <section
      className="hero-v2-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setIsDragging(false);
        setDragOffset(0);
      }}
    >
      <div
        className="hero-v2-viewport relative overflow-hidden bg-[#FAFAFA]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="hero-banner-track flex h-full"
          style={{
            transform: `translateX(calc(-${active * 100}% + ${isDragging ? dragOffset : 0}px))`,
            transition: isDragging ? "none" : `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          {SLIDES.map((slide, slideIndex) => (
            <div key={slide.id} className="hero-v2-slide relative min-w-full shrink-0">
              <div className="pointer-events-none absolute inset-0 bg-[#FAFAFA]" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: SLIDE_GRADIENTS[slideIndex] }}
              />

              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 xl:px-10">
                <div className="text-center lg:text-left">
                  {slide.brand ? (
                    <div className="mb-5 flex justify-center lg:justify-start">
                      <PimartLogo variant="wordmark" height={48} className="max-w-[280px]" />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                      {T(slide.titleKey)}
                    </h1>
                  )}
                  {!slide.brand && (
                    <p className="mt-2 text-lg font-medium text-[#374151] sm:text-xl">
                      {T(slide.subtitleKey)}
                    </p>
                  )}
                  {slide.brand && (
                    <>
                      <p className="mt-3 text-xl font-medium text-[#374151] sm:text-2xl">
                        {T(slide.subtitleKey)}
                      </p>
                    </>
                  )}
                  <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#6B7280] sm:text-base lg:mx-0">
                    {T(slide.descKey)}
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                    {slide.ctas.map((cta) =>
                      cta.primary ? (
                        <Link
                          key={cta.key}
                          href={cta.href}
                          className="btn-primary min-h-11 rounded-full px-6 text-sm"
                        >
                          {T(cta.key)}
                        </Link>
                      ) : (
                        <Link
                          key={cta.key}
                          href={cta.href}
                          className="btn-secondary min-h-11 rounded-full px-6 text-sm"
                        >
                          {T(cta.key)}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-center lg:mt-0">
                  {slide.visual === "brand" && <HeroBrandVisual products={products} />}
                  {slide.visual === "psa" && <HeroPsaVisual />}
                  {slide.visual === "b2b" && <HeroB2BVisual />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="hero-banner-arrow absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="hero-banner-arrow absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex"
          aria-label="Next"
        >
          ›
        </button>

        <div className="hero-dots absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2 lg:bottom-6">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              className={`hero-dot ${i === active ? "hero-dot-active" : "hero-dot-inactive"}`}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
