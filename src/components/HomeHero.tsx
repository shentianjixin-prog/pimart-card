"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-context";
import { PimartLogo } from "@/components/PimartLogo";
import {
  HeroBrandVisual,
  HeroPsaSlideBackground,
  HeroPsaVisual,
} from "@/components/home/HeroVisuals";

export type HeroStackProduct = {
  name: string;
  images: string;
  slug: string;
};

const SLIDE_COUNT = 3;
const AUTOPLAY_MS = 10000;
const TRANSITION_MS = 780;

const SLIDE_GRADIENTS = [
  "radial-gradient(ellipse 80% 60% at 18% 20%, rgba(240,249,255,0.95) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 18%, rgba(255,247,214,0.7) 0%, transparent 50%), radial-gradient(ellipse 90% 55% at 55% 100%, rgba(226,232,240,0.55) 0%, transparent 55%)",
  "radial-gradient(circle at 20% 30%, #FFF0F5 0%, transparent 52%), radial-gradient(circle at 80% 20%, #EAF4FF 0%, transparent 48%)",
  "radial-gradient(ellipse 75% 60% at 50% 0%, rgba(234,244,255,0.95) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,247,214,0.55) 0%, transparent 50%)",
];

type SlideConfig = {
  id: number;
  brand?: boolean;
  titleKey: string;
  subtitleKey: string;
  descKey: string;
  ctas: { key: string; href: string; primary?: boolean }[];
  visual: "brand" | "psa" | "b2b" | "none";
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
      { key: "hero_v2_cta_psa", href: "/?stock=instock" },
    ],
    visual: "brand",
  },
  {
    id: 1,
    titleKey: "hero_v2_s2_title",
    subtitleKey: "hero_v2_s2_sub",
    descKey: "hero_v2_s2_desc",
    ctas: [
      { key: "hero_v2_cta_psa", href: "/?stock=instock", primary: true },
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
      { key: "hero_v2_cta_learn", href: "/contact", primary: true },
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
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const activeRef = useRef(0);

  const goTo = useCallback((index: number) => {
    const next = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
    activeRef.current = next;
    setActive(next);
  }, []);

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setSlideWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || isDragging) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, isDragging, goNext]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    dragOffsetRef.current = 0;
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragOffset(0);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDraggingRef.current) return;
    const offset = e.touches[0].clientX - touchStartX.current;
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  }

  function handleTouchEnd() {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const offset = dragOffsetRef.current;
    const threshold = Math.min(50, Math.max(28, slideWidth * 0.15));
    if (offset < -threshold) goNext();
    else if (offset > threshold) goPrev();
    dragOffsetRef.current = 0;
    setDragOffset(0);
  }

  const trackOffset =
    slideWidth > 0 ? -active * slideWidth + (isDragging ? dragOffset : 0) : 0;

  return (
    <section
      className="hero-v2-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        isDraggingRef.current = false;
        dragOffsetRef.current = 0;
        setIsDragging(false);
        setDragOffset(0);
      }}
    >
      <div
        ref={viewportRef}
        className="hero-v2-viewport relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="hero-banner-track flex"
          style={{
            transform: `translate3d(${trackOffset}px, 0, 0)`,
            transition: isDragging
              ? "none"
              : `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          {SLIDES.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`hero-v2-slide relative shrink-0 ${slideIndex === active ? "is-active" : ""}`}
            >
              {slide.visual === "psa" ? (
                <HeroPsaSlideBackground />
              ) : slide.visual === "b2b" ? (
                <div className="hero-v2-b2b-art" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-b2b-lugia.png?v=6"
                    alt=""
                    className="hero-v2-b2b-art-img hero-v2-b2b-art-img--blur"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-b2b-lugia.png?v=6"
                    alt=""
                    className="hero-v2-b2b-art-img hero-v2-b2b-art-img--sharp"
                  />
                  <div className="hero-v2-b2b-art-veil" />
                  <div className="hero-v2-b2b-fx">
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--1" />
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--2" />
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--3" />
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--4" />
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--5" />
                    <span className="hero-v2-b2b-fx-spark hero-v2-b2b-fx-spark--6" />
                    <span className="hero-v2-b2b-fx-wave" />
                    <span className="hero-v2-b2b-fx-wave hero-v2-b2b-fx-wave--late" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[#F7F8FA]" />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: SLIDE_GRADIENTS[slideIndex] }}
                  />
                  <div className="hero-v2-grain" aria-hidden />
                </>
              )}

              <div
                className={`relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 lg:items-center lg:px-8 xl:px-10 ${
                  slide.brand
                    ? "lg:grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.32fr)] lg:gap-5 xl:gap-7"
                    : slide.visual === "b2b"
                      ? "hero-v2-b2b-frame"
                      : "lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12"
                }`}
              >
                <div
                  className={`hero-v2-copy ${
                    slide.brand
                      ? "hero-v2-copy-brand"
                      : slide.visual === "b2b"
                        ? "hero-v2-b2b"
                        : "text-center lg:text-left"
                  }`}
                >
                  {slide.brand ? (
                    <>
                      <div className="hero-v2-brand-stack">
                        <PimartLogo variant="wordmark" height={52} className="hero-v2-brand-logo" />
                        <p className="hero-v2-brand-sub">{T(slide.subtitleKey)}</p>
                        {T(slide.descKey) ? (
                          <p className="hero-v2-brand-desc">{T(slide.descKey)}</p>
                        ) : null}
                      </div>
                      <div className="mt-7 flex flex-nowrap justify-center gap-2.5 sm:mt-10 sm:gap-3 lg:justify-start">
                        {slide.ctas.map((cta) =>
                          cta.primary ? (
                            <Link
                              key={cta.key}
                              href={cta.href}
                              className="btn-primary min-h-11 flex-1 rounded-full px-4 text-center text-sm sm:flex-none sm:px-7"
                            >
                              {T(cta.key)}
                            </Link>
                          ) : (
                            <Link
                              key={cta.key}
                              href={cta.href}
                              className="btn-secondary min-h-11 flex-1 rounded-full px-4 text-center text-sm sm:flex-none sm:px-7"
                            >
                              {T(cta.key)}
                            </Link>
                          )
                        )}
                      </div>
                    </>
                  ) : slide.visual === "b2b" ? (
                    <div className="hero-v2-b2b-stack">
                      <p className="hero-v2-b2b-kicker">PIMART B2B</p>
                      <h1 className="hero-v2-b2b-title">{T(slide.titleKey)}</h1>
                      <p className="hero-v2-b2b-lead">{T(slide.subtitleKey)}</p>
                      {T(slide.descKey) ? (
                        <p className="hero-v2-b2b-desc">{T(slide.descKey)}</p>
                      ) : null}
                      <div className="hero-v2-b2b-actions">
                        {slide.ctas.map((cta) => (
                          <Link key={cta.key} href={cta.href} className="hero-v2-b2b-cta">
                            {T(cta.key)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                        {T(slide.titleKey)}
                      </h1>
                      <p className="mt-2 text-lg font-medium text-[#374151] sm:text-xl">
                        {T(slide.subtitleKey)}
                      </p>
                      {T(slide.descKey) ? (
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B7280] sm:mt-4 sm:text-base lg:mx-0">
                          {T(slide.descKey)}
                        </p>
                      ) : null}
                      <div className="mt-7 flex flex-nowrap justify-center gap-2.5 sm:mt-10 sm:gap-3 lg:justify-start">
                        {slide.ctas.map((cta) =>
                          cta.primary ? (
                            <Link
                              key={cta.key}
                              href={cta.href}
                              className="btn-primary min-h-11 flex-1 rounded-full px-4 text-center text-sm sm:flex-none sm:px-7"
                            >
                              {T(cta.key)}
                            </Link>
                          ) : (
                            <Link
                              key={cta.key}
                              href={cta.href}
                              className="btn-secondary min-h-11 flex-1 rounded-full px-4 text-center text-sm sm:flex-none sm:px-7"
                            >
                              {T(cta.key)}
                            </Link>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>

                {slide.visual !== "b2b" && slide.visual !== "none" && (
                  <div
                    className={
                      slide.brand
                        ? "hero-brand-column mt-6 lg:mt-0"
                        : slide.visual === "psa"
                          ? "hero-psa-column mt-6 lg:mt-0"
                          : "mt-6 flex justify-center lg:mt-0"
                    }
                  >
                    {slide.visual === "brand" && <HeroBrandVisual products={products} />}
                    {slide.visual === "psa" && <HeroPsaVisual />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="hero-banner-arrow absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 lg:flex xl:left-5"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="hero-banner-arrow absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 lg:flex xl:right-5"
          aria-label="Next"
        >
          ›
        </button>

        <div className="hero-dots absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2 lg:bottom-5">
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
