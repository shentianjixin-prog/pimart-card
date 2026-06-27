"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-context";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const SLIDE_COUNT = 4;
const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 500;

const SLIDE_GRADIENTS = [
  "radial-gradient(circle at 18% 18%, #F0F9FF 0%, transparent 52%), radial-gradient(circle at 82% 28%, #F8F5FF 0%, transparent 48%), radial-gradient(circle at 50% 92%, #FFF7D6 0%, transparent 42%)",
  "radial-gradient(circle at 20% 30%, #F8F5FF 0%, transparent 50%), radial-gradient(circle at 75% 20%, #F0F9FF 0%, transparent 45%)",
  "radial-gradient(circle at 15% 70%, #FFF0F5 0%, transparent 48%), radial-gradient(circle at 85% 35%, #EAF4FF 0%, transparent 45%)",
  "radial-gradient(circle at 50% 20%, #FFF7D6 0%, transparent 50%), radial-gradient(circle at 30% 80%, #F3EEFF 0%, transparent 45%)",
];

const STACK_STYLES = [
  { rotate: -14, x: -72, y: 22, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #ffffff 100%)" },
  { rotate: -5, x: -26, y: -6, z: 2, bg: "linear-gradient(135deg, #F3EEFF 0%, #ffffff 100%)" },
  { rotate: 0, x: 0, y: 0, z: 3, bg: "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)" },
  { rotate: 7, x: 28, y: -12, z: 2, bg: "linear-gradient(135deg, #FFF0F5 0%, #ffffff 100%)" },
  { rotate: 14, x: 68, y: 22, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #FFF0F5 100%)" },
];

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardStack({ products }: { products: HeroStackProduct[] }) {
  const stack = products.slice(0, 5);
  while (stack.length < 5) {
    stack.push({ name: "TCG Box", images: "/products/placeholder.svg", slug: "#" });
  }

  return (
    <div className="hero-visual-stack relative mx-auto flex h-[300px] w-[320px] max-w-[85vw] items-center justify-center sm:h-[380px] lg:h-[420px] lg:w-[460px] lg:max-w-[50vw]">
      {stack.map((product, i) => {
        const style = STACK_STYLES[i];
        const image = product.images.split(",")[0]?.trim() || "/products/placeholder.svg";
        return (
          <Link
            key={`${product.slug}-${i}`}
            href={product.slug === "#" ? "/" : `/products/${product.slug}`}
            className="hero-stack-card group absolute w-[38%] max-w-[140px] cursor-pointer sm:max-w-[160px] lg:max-w-[180px]"
            style={{
              zIndex: style.z,
              ["--stack-x" as string]: `${style.x}`,
              ["--stack-y" as string]: `${style.y}`,
              ["--stack-r" as string]: `${style.rotate}`,
            }}
          >
            <div
              className="hero-stack-inner overflow-hidden rounded-[20px] border border-[rgba(17,24,39,0.08)] p-2.5 sm:p-3"
              style={{ background: style.bg }}
            >
              <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[14px] bg-white">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  unoptimized={image.endsWith(".svg")}
                  sizes="(max-width: 1024px) 140px, 180px"
                  className="object-contain p-2 transition duration-300 group-hover:scale-105"
                  priority={i === 2}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function PlaceholderVisual({ slideIndex }: { slideIndex: number }) {
  const images = [
    "/products/cs65-box.png",
    "/products/ylsc-collect-box.png",
    "/products/cbb3c-box.png",
  ];
  const img = images[(slideIndex - 1) % images.length];
  return (
    <div className="hero-visual-single mx-auto flex w-[320px] max-w-[85vw] items-center justify-center lg:w-[460px] lg:max-w-[50vw]">
      <div className="hero-visual-card w-full cursor-pointer overflow-hidden rounded-[24px] border border-[rgba(17,24,39,0.08)] bg-white p-4 shadow-[0_28px_70px_rgba(17,24,39,0.12)] transition duration-300 hover:-translate-y-1 hover:rotate-1">
        <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[18px] bg-[#f7f8fa]">
          <Image src={img} alt="" fill className="object-contain p-4" sizes="460px" />
        </div>
      </div>
    </div>
  );
}

type SlideConfig = {
  id: number;
  titleKey: string;
  useBrandTitle?: boolean;
  descKey: string;
  subtitleKey?: string;
  ctas: { key: string; href: string; primary?: boolean }[];
  visual: "stack" | "placeholder";
};

const SLIDES: SlideConfig[] = [
  {
    id: 0,
    titleKey: "",
    useBrandTitle: true,
    descKey: "hero_desc",
    subtitleKey: "hero_subtitle",
    ctas: [
      { key: "hero_cta_new", href: "/?sort=newest&inStock=1", primary: true },
      { key: "hero_cta_wholesale", href: "/contact" },
      { key: "hero_cta_psa", href: "/?q=PSA" },
    ],
    visual: "stack",
  },
  {
    id: 1,
    titleKey: "hero_slide2_title",
    descKey: "hero_slide2_desc",
    subtitleKey: "hero_slide2_sub",
    ctas: [{ key: "hero_slide2_cta", href: "/?sort=newest&inStock=1", primary: true }],
    visual: "placeholder",
  },
  {
    id: 2,
    titleKey: "hero_slide3_title",
    descKey: "hero_slide3_desc",
    subtitleKey: "hero_slide3_sub",
    ctas: [{ key: "hero_slide3_cta", href: "/?q=PSA", primary: true }],
    visual: "placeholder",
  },
  {
    id: 3,
    titleKey: "hero_slide4_title",
    descKey: "hero_slide4_desc",
    subtitleKey: "hero_slide4_sub",
    ctas: [{ key: "hero_slide4_cta", href: "/contact", primary: true }],
    visual: "placeholder",
  },
];

export function HomeHero({ products }: { products: HeroStackProduct[] }) {
  const T = useT();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

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
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragOffset(dx);
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
      className="hero-banner-root relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setIsDragging(false);
        setDragOffset(0);
      }}
    >
      <div
        ref={viewportRef}
        className="hero-banner-viewport hero-panel relative overflow-hidden rounded-[28px] border border-[rgba(17,24,39,0.08)] shadow-[0_8px_30px_rgba(17,24,39,0.06)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="hero-banner-track flex"
          style={{
            transform: `translateX(calc(-${active * 100}% + ${isDragging ? dragOffset : 0}px))`,
            transition: isDragging ? "none" : `transform ${TRANSITION_MS}ms ease`,
          }}
        >
          {SLIDES.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className="hero-banner-slide relative min-w-full shrink-0 px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-white"
                style={{ background: `#ffffff` }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-100"
                style={{ background: SLIDE_GRADIENTS[slideIndex] }}
              />

              <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                    {slide.useBrandTitle ? "PIMART CARD" : T(slide.titleKey)}
                  </h1>

                  <p className="hero-desc mx-auto mt-5 max-w-xl lg:mx-0">
                    {T(slide.descKey)}
                  </p>

                  {slide.subtitleKey && (
                    <p className="mt-3 text-sm font-medium tracking-tight text-[#9ca3af] sm:text-base">
                      {T(slide.subtitleKey)}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap justify-center gap-3 lg:mt-10 lg:justify-start">
                    {slide.ctas.map((cta) =>
                      cta.primary ? (
                        <Link key={cta.href} href={cta.href} className="btn-primary min-h-11">
                          {T(cta.key)}
                        </Link>
                      ) : (
                        <Link key={cta.href} href={cta.href} className="btn-secondary min-h-11">
                          {T(cta.key)}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {slide.visual === "stack" ? (
                    <CardStack products={products} />
                  ) : (
                    <PlaceholderVisual slideIndex={slideIndex} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="hero-banner-arrow absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-[rgba(17,24,39,0.08)] bg-white/90 p-2.5 text-[#374151] shadow-sm backdrop-blur-sm transition hover:bg-white lg:flex touch-target"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="hero-banner-arrow absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-[rgba(17,24,39,0.08)] bg-white/90 p-2.5 text-[#374151] shadow-sm backdrop-blur-sm transition hover:bg-white lg:flex touch-target"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-1.5 sm:bottom-5">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              className={`hero-dot rounded-full transition-all duration-300 ${
                i === active ? "hero-dot-active" : "hero-dot-inactive"
              }`}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
