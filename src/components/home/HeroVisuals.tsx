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
  frameClassName,
  aspect = "5/7",
}: {
  src: string;
  alt: string;
  wrapperClassName: string;
  frameClassName: string;
  aspect?: "5/7" | "square";
}) {
  return (
    <div className={wrapperClassName}>
      <div className={frameClassName}>
        <div
          className={`relative w-full overflow-hidden rounded-[14px] bg-white ${
            aspect === "square" ? "aspect-square" : "aspect-[5/7]"
          }`}
        >
          <ProductFrameImage src={src} alt={alt} />
        </div>
      </div>
    </div>
  );
}

const STACK = [
  { r: -14, x: -72, y: 20, z: 1, bg: "linear-gradient(135deg,#EAF4FF,#fff)" },
  { r: -6, x: -28, y: -6, z: 2, bg: "linear-gradient(135deg,#F3EEFF,#fff)" },
  { r: 0, x: 0, y: 0, z: 4, bg: "linear-gradient(135deg,#FFF7D6,#fff)" },
  { r: 7, x: 32, y: -10, z: 3, bg: "linear-gradient(135deg,#FFF0F5,#fff)" },
  { r: 13, x: 68, y: 18, z: 2, bg: "linear-gradient(135deg,#EAF4FF,#FFF0F5)" },
];

const HERO_BRAND_SLOTS: { src: string; alt: string }[] = [
  { src: "/products/151-box.png", alt: "宝可梦 151" },
  { src: "/images/hero-pack-gengar.jpg", alt: "宝可梦 宝石包 VOL.3" },
  { src: "/products/csv8c-box.png", alt: "宝可梦 星彩晶璃" },
  { src: "/images/hero-pack-terastal.jpg", alt: "宝可梦 太晶盛聚" },
  { src: "/images/hero-card-brock.png", alt: "小刚的发掘 SAR" },
];

function HeroBrandImage({ src, alt }: { src: string; alt: string }) {
  return <ProductFrameImage src={src} alt={alt} />;
}

export function HeroBrandVisual(_props: { products: HeroStackProduct[] }) {
  return (
    <div className="hero-v2-visual hero-brand-visual relative mx-auto h-[220px] w-full max-w-[420px] overflow-hidden rounded-[28px] sm:h-[260px] lg:h-[320px] lg:max-w-[480px]">
      <div className="hero-brand-poster absolute inset-0 z-0" aria-hidden>
        <Image
          src="/images/hero-brand-poster.png"
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="hero-brand-poster-overlay absolute inset-0" />
      </div>

      <div className="hero-float-group relative z-[1] h-full w-full">
        <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2">
          {HERO_BRAND_SLOTS.map((slot, i) => {
            const s = STACK[i];
            return (
              <div
                key={`hero-brand-slot-${i}`}
                className="hero-stack-card absolute w-[36%] max-w-[130px]"
                style={{
                  zIndex: s.z,
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px)) rotate(${s.r}deg)`,
                }}
              >
                <div
                  className="overflow-hidden rounded-[18px] border border-[rgba(15,23,42,0.08)] p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                  style={{ background: s.bg }}
                >
                  <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[14px] bg-white">
                    <HeroBrandImage src={slot.src} alt={slot.alt} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
    <div className="hero-v2-visual hero-psa-stack-wrap">
      <div className="hero-psa-stack">
        {cards.map((card) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={card.src} src={card.src} alt={card.alt} className={card.className} />
        ))}
      </div>
    </div>
  );
}

const B2B_FRAME =
  "rounded-[20px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm";
const B2B_FRAME_SM =
  "rounded-[18px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm";

/** Fixed hero B2B frames — no random/placeholder slots */
const B2B_HERO_FRAMES = [
  {
    src: "/images/hero-pack-gengar.jpg",
    alt: "宝可梦 宝石包 VOL.3",
    wrapperClassName: "hero-float-slow absolute left-[4%] top-[10%] w-[36%]",
    frameClassName: B2B_FRAME,
    aspect: "5/7" as const,
  },
  {
    src: "/images/psa-zekrom.jpg",
    alt: "捷克罗姆 PSA 10",
    wrapperClassName: "hero-float-delay absolute right-[2%] top-[14%] w-[34%]",
    frameClassName: B2B_FRAME,
    aspect: "5/7" as const,
  },
  {
    src: "/images/hero-pack-terastal.jpg",
    alt: "宝可梦 太晶盛聚",
    wrapperClassName: "hero-float-slow absolute bottom-[6%] left-[18%] w-[32%]",
    frameClassName: B2B_FRAME_SM,
    aspect: "5/7" as const,
  },
  {
    src: "/products/cbb5c-box.png",
    alt: "宝可梦 原盒",
    wrapperClassName: "hero-float-delay absolute bottom-[10%] right-[12%] w-[38%]",
    frameClassName: B2B_FRAME,
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
