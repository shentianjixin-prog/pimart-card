"use client";

import Image from "next/image";
import { useState } from "react";
import { CardPlaceholder } from "@/components/HeroPlaceholders";
import type { HeroStackProduct } from "@/components/HomeHero";

function ProductFrameImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CardPlaceholder />;
  return (
    // Native img — avoids Next optimizer issues with large / mislabeled product files
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-contain p-1.5"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function B2BBoxFrame({
  src,
  alt,
  wrapperClassName,
  aspect = "5/7",
}: {
  src: string;
  alt: string;
  wrapperClassName: string;
  aspect?: "5/7" | "square";
}) {
  return (
    <div className={wrapperClassName}>
      <div
        className={`relative w-full overflow-visible ${
          aspect === "square" ? "aspect-square" : "aspect-[5/7]"
        }`}
      >
        <HeroBrandImage src={src} alt={alt} />
      </div>
    </div>
  );
}

const STACK = [
  { r: -14, x: -108, y: 20, z: 1 },
  { r: -6, x: -52, y: -6, z: 2 },
  { r: 0, x: 0, y: 0, z: 4 },
  { r: 7, x: 52, y: -10, z: 3 },
  { r: 13, x: 104, y: 18, z: 2 },
];

const HERO_BRAND_SLOTS: { src: string; alt: string }[] = [
  { src: "/products/151-box.png", alt: "宝可梦 151" },
  { src: "/images/hero-pack-gengar.jpg", alt: "宝可梦 宝石包 VOL.3" },
  { src: "/products/csv8c-box.png", alt: "宝可梦 星彩晶璃" },
  { src: "/images/hero-pack-terastal.jpg", alt: "宝可梦 太晶盛聚" },
  { src: "/images/hero-card-brock.png", alt: "小刚的发掘 SAR" },
];

function HeroBrandImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CardPlaceholder />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function HeroBrandVisual(_props: { products: HeroStackProduct[] }) {
  return (
    <div className="hero-brand-stage">
      <div className="hero-v2-visual hero-brand-visual">
        <div className="hero-float-group hero-brand-cards">
          <div className="hero-brand-cards-inner">
            {HERO_BRAND_SLOTS.map((slot, i) => {
              const s = STACK[i];
              return (
                <div
                  key={`hero-brand-slot-${i}`}
                  className="hero-stack-card absolute w-[36%] max-w-[130px] sm:max-w-[140px] lg:max-w-[150px]"
                  style={{
                    zIndex: s.z,
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px)) rotate(${s.r}deg)`,
                  }}
                >
                  <div className="relative aspect-[5/7] w-full overflow-visible">
                    <HeroBrandImage src={slot.src} alt={slot.alt} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** PSA 轮播全幅背景 — 天空 + 抠图喷火龙 */
export function HeroPsaSlideBackground() {
  return (
    <div className="hero-psa-slide-bg" aria-hidden>
      <div className="hero-psa-slide-bg-sky" />
      <div className="hero-psa-slide-bg-clouds" />
      <div className="hero-psa-slide-bg-character">
        <Image
          src="/images/hero-psa-charizard-cutout.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 70vw, 440px"
          className="hero-psa-slide-bg-cutout object-contain object-[center_18%]"
          priority={false}
          unoptimized
        />
        <div className="hero-psa-slide-bg-character-glow" />
      </div>
      <div className="hero-psa-slide-bg-ground" />
      <div className="hero-psa-slide-bg-vignette" />
      <div className="hero-psa-slide-bg-edge hero-psa-slide-bg-edge--top" />
      <div className="hero-psa-slide-bg-edge hero-psa-slide-bg-edge--left" />
      <div className="hero-psa-slide-bg-edge hero-psa-slide-bg-edge--right" />
      <div className="hero-psa-slide-bg-edge hero-psa-slide-bg-edge--bottom" />
    </div>
  );
}

export function HeroPsaVisual() {
  const cards = [
    { src: "/images/psa-zekrom.jpg", alt: "Zekrom PSA 10 Gold", className: "hero-psa-card hero-psa-left" },
    { src: "/images/psa-gyarados.jpg", alt: "Gyarados EX PSA 10", className: "hero-psa-card hero-psa-center" },
    { src: "/images/psa-reshiram.jpg", alt: "Reshiram PSA 10 Gold", className: "hero-psa-card hero-psa-right" },
  ] as const;

  return (
    <div className="hero-psa-stage">
      <div className="hero-v2-visual hero-psa-stack-wrap">
        <div className="hero-psa-stack">
          {cards.map((card) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={card.src} src={card.src} alt={card.alt} className={card.className} />
          ))}
        </div>
      </div>
    </div>
  );
}

const B2B_HERO_FRAMES = [
  {
    src: "/images/hero-pack-gengar.jpg",
    alt: "宝可梦 宝石包 VOL.3",
    wrapperClassName: "hero-float-slow absolute left-[4%] top-[10%] w-[36%]",
    aspect: "5/7" as const,
  },
  {
    src: "/images/psa-zekrom.jpg",
    alt: "捷克罗姆 PSA 10",
    wrapperClassName: "hero-float-delay absolute right-[2%] top-[14%] w-[34%]",
    aspect: "5/7" as const,
  },
  {
    src: "/images/hero-pack-terastal.jpg",
    alt: "宝可梦 太晶盛聚",
    wrapperClassName: "hero-float-slow absolute bottom-[6%] left-[18%] w-[32%]",
    aspect: "5/7" as const,
  },
  {
    src: "/products/cbb5c-box.png",
    alt: "宝可梦 原盒",
    wrapperClassName: "hero-float-delay absolute bottom-[10%] right-[12%] w-[38%]",
    aspect: "square" as const,
  },
] as const;

export function HeroB2BVisual() {
  return (
    <div className="hero-v2-visual hero-float-group relative mx-auto h-[220px] w-full max-w-[400px] sm:h-[260px] lg:h-[300px]">
      {B2B_HERO_FRAMES.map((frame) => (
        <B2BBoxFrame key={frame.src} {...frame} />
      ))}
    </div>
  );
}

export function B2BSectionVisual() {
  return (
    <div className="b2b-visual hero-float-group relative mx-auto h-[280px] w-full max-w-[420px] lg:mx-0 lg:h-[340px]">
      <HeroB2BVisual />
    </div>
  );
}
