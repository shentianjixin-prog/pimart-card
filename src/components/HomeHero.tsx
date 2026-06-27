"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-context";
import {
  BoxPlaceholder,
  CardPlaceholder,
  isUsableProductImage,
  PsaSlabPlaceholder,
} from "@/components/HeroPlaceholders";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

export type SlideStacks = [HeroStackProduct[], HeroStackProduct[], HeroStackProduct[]];

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
  { rotate: -12, x: -56, y: 16, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #ffffff 100%)" },
  { rotate: -4, x: -20, y: -4, z: 2, bg: "linear-gradient(135deg, #F3EEFF 0%, #ffffff 100%)" },
  { rotate: 0, x: 0, y: 0, z: 3, bg: "linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)" },
  { rotate: 5, x: 22, y: -8, z: 2, bg: "linear-gradient(135deg, #FFF0F5 0%, #ffffff 100%)" },
  { rotate: 11, x: 52, y: 16, z: 1, bg: "linear-gradient(135deg, #EAF4FF 0%, #FFF0F5 100%)" },
];

function StackCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!isUsableProductImage(src) || failed) {
    return <CardPlaceholder />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={src.endsWith(".svg")}
      sizes="120px"
      className="object-contain p-2"
      onError={() => setFailed(true)}
    />
  );
}

function CardStack({ products }: { products: HeroStackProduct[] }) {
  const stack = products.slice(0, 5);
  while (stack.length < 5) {
    stack.push({ name: "TCG Box", images: "", slug: "#" });
  }

  return (
    <div className="hero-visual-stack relative mx-auto flex h-[180px] w-[280px] max-w-[85vw] items-center justify-center sm:h-[200px] sm:w-[300px] lg:h-[220px] lg:w-[360px] lg:max-w-[50vw]">
      {stack.map((product, i) => {
        const style = STACK_STYLES[i];
        const image = product.images.split(",")[0]?.trim();
        return (
          <Link
            key={`${product.slug}-${i}`}
            href={product.slug === "#" ? "/" : `/products/${product.slug}`}
            className="hero-stack-card group absolute w-[34%] max-w-[110px] cursor-pointer lg:max-w-[120px]"
            style={{
              zIndex: style.z,
              ["--stack-x" as string]: `${style.x}`,
              ["--stack-y" as string]: `${style.y}`,
              ["--stack-r" as string]: `${style.rotate}`,
            }}
          >
            <div
              className="hero-stack-inner overflow-hidden rounded-[16px] border border-[rgba(17,24,39,0.08)] p-2"
              style={{ background: style.bg }}
            >
              <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[12px] bg-white">
                <StackCardImage src={image} alt={product.name} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function SlideVisual({
  slideIndex,
  products,
  slideStacks,
}: {
  slideIndex: number;
  products: HeroStackProduct[];
  slideStacks?: SlideStacks;
}) {
  if (slideIndex === 0) {
    return <CardStack products={products} />;
  }
  const extra = slideStacks?.[slideIndex - 1 as 0 | 1 | 2];
  if (extra && extra.length > 0) {
    return <CardStack products={extra} />;
  }
  const variant = slideIndex === 2 ? "psa" : "box";
  return (
    <div className="hero-visual-single mx-auto w-[240px] max-w-[85vw] sm:w-[280px] lg:w-[320px] lg:max-w-[50vw]">
      <div className="hero-visual-card overflow-hidden rounded-[20px] border border-[rgba(17,24,39,0.08)] bg-white p-3 shadow-[0_20px_50px_rgba(17,24,39,0.1)]">
        {variant === "psa" ? <PsaSlabPlaceholder /> : <BoxPlaceholder />}
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
  },
  {
    id: 1,
    titleKey: "hero_slide2_title",
    descKey: "hero_slide2_desc",
    subtitleKey: "hero_slide2_sub",
    ctas: [{ key: "hero_slide2_cta", href: "/?sort=newest&inStock=1", primary: true }],
  },
  {
    id: 2,
    titleKey: "hero_slide3_title",
    descKey: "hero_slide3_desc",
    subtitleKey: "hero_slide3_sub",
    ctas: [{ key: "hero_slide3_cta", href: "/?q=PSA", primary: true }],
  },
  {
    id: 3,
    titleKey: "hero_slide4_title",
    descKey: "hero_slide4_desc",
    subtitleKey: "hero_slide4_sub",
    ctas: [{ key: "hero_slide4_cta", href: "/contact", primary: true }],
  },
];

export function HomeHero({ products, slideStacks }: { products: HeroStackProduct[]; slideStacks?: SlideStacks }) {
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
      className="hero-banner-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setIsDragging(false);
        setDragOffset(0);
      }}
    >
      <div
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
            <div key={slide.id} className="hero-banner-slide relative min-w-full shrink-0">
              <div className="pointer-events-none absolute inset-0 bg-white" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: SLIDE_GRADIENTS[slideIndex] }}
              />

              <div className="relative flex h-full flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-10 lg:py-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                    {slide.useBrandTitle ? "PIMART CARD" : T(slide.titleKey)}
                  </h1>
                  <p className="hero-desc mx-auto mt-3 max-w-xl lg:mx-0">{T(slide.descKey)}</p>
                  {slide.subtitleKey && (
                    <p className="mt-2 text-sm font-medium text-[#9ca3af]">{T(slide.subtitleKey)}</p>
                  )}
                  <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                    {slide.ctas.map((cta) =>
                      cta.primary ? (
                        <Link key={cta.href} href={cta.href} className="btn-primary min-h-11 px-5 text-sm">
                          {T(cta.key)}
                        </Link>
                      ) : (
                        <Link key={cta.href} href={cta.href} className="btn-secondary min-h-11 px-5 text-sm">
                          {T(cta.key)}
                        </Link>
                      )
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center lg:mt-0">
                  <SlideVisual slideIndex={slideIndex} products={products} slideStacks={slideStacks} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="hero-banner-arrow absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 lg:flex"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="hero-banner-arrow absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 lg:flex"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="hero-dots flex items-center justify-center gap-1.5 pb-3 pt-1 lg:absolute lg:bottom-3 lg:left-0 lg:right-0 lg:pb-0 lg:pt-0">
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
