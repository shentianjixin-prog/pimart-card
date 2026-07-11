"use client";

import Image from "next/image";
import Link from "next/link";
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

const HERO_BRAND_SLOTS = [
  {
    src: "/products/151-box.png",
    alt: "宝可梦 151",
    label: "151",
    imageKey: "151-box",
    nameHints: ["151"],
    fallbackSlug: "ポケモンカ-ド151-box-简中",
  },
  {
    src: "/products/cbb5c-box.png",
    alt: "宝可梦 宝石包第五弹",
    label: "宝石包第五弹",
    imageKey: "cbb5c",
    nameHints: ["宝石包第五", "宝石包第五弹", "CBB5"],
    fallbackSlug: "宝石包第五弹-box-简中",
  },
  {
    src: "/products/csv9c-box.png",
    alt: "宝可梦 星彩晶璃",
    label: "星彩晶璃",
    imageKey: "csv9c",
    nameHints: ["星彩晶璃", "CSV9"],
    fallbackSlug: "星彩晶璃-box-简中",
  },
  {
    src: "/products/csv3c-box.png",
    alt: "宝可梦 无畏太晶",
    label: "无畏太晶",
    imageKey: "csv3c",
    nameHints: ["无畏太晶", "CSV3"],
    fallbackSlug: "无畏太晶-box-简中",
  },
  {
    src: "/images/hero-card-brock.png",
    alt: "小刚的发掘 SAR",
    label: "小刚的发掘",
    imageKey: "brock",
    nameHints: ["小刚", "发掘", "Brock"],
    fallbackSlug: null,
    fallbackHref: "/?game=pokemon",
  },
] as const;

type BrandSlot = (typeof HERO_BRAND_SLOTS)[number];

/** 桌面焦点货架：中心主推，两侧叠放 */
const SHELF_LAYOUT = [
  { role: "side", side: "far-left", rotate: -10 },
  { role: "side", side: "near-left", rotate: -5 },
  { role: "feature", side: "center", rotate: 0 },
  { role: "side", side: "near-right", rotate: 5 },
  { role: "side", side: "far-right", rotate: 10 },
] as const;

function resolveBrandProduct(
  products: HeroStackProduct[],
  slot: BrandSlot
): HeroStackProduct | null {
  const byImage = products.find((p) => p.images?.includes(slot.imageKey));
  if (byImage) return byImage;

  const byName = products.find((p) => {
    const name = p.name ?? "";
    return slot.nameHints.some((hint) => name.includes(hint));
  });
  if (byName) return byName;

  return null;
}

function resolveBrandHref(products: HeroStackProduct[], slot: BrandSlot) {
  const matched = resolveBrandProduct(products, slot);
  if (matched?.slug) return `/products/${matched.slug}`;
  if ("fallbackSlug" in slot && slot.fallbackSlug) {
    return `/products/${slot.fallbackSlug}`;
  }
  if ("fallbackHref" in slot && slot.fallbackHref) {
    return slot.fallbackHref;
  }
  return "/?sort=newest&stock=instock";
}

function HeroBrandImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CardPlaceholder />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-contain"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}

export function HeroBrandVisual({ products }: { products: HeroStackProduct[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="hero-brand-stage">
      <div className="hero-brand-visual" aria-label="精选商品">
        {/* 桌面：焦点货架 */}
        <div className="hero-brand-shelf" role="list">
          {HERO_BRAND_SLOTS.map((slot, i) => {
            const layout = SHELF_LAYOUT[i];
            const isFeature = layout.role === "feature";
            const isHovered = hovered === i;
            const href = resolveBrandHref(products, slot);

            return (
              <Link
                key={`hero-brand-slot-${i}`}
                href={href}
                role="listitem"
                className={`hero-brand-card hero-brand-card--${layout.side} ${
                  isFeature ? "hero-brand-card--feature" : "hero-brand-card--side"
                } ${isHovered ? "is-hovered" : ""}`}
                style={{
                  zIndex: isHovered ? 30 : isFeature ? 20 : 10 - Math.abs(i - 2),
                  ["--brand-rotate" as string]: `${layout.rotate}deg`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`${slot.alt} — 查看商品`}
              >
                <div className="hero-brand-card-frame">
                  <HeroBrandImage src={slot.src} alt={slot.alt} priority={i >= 1 && i <= 3} />
                </div>
                <span className="hero-brand-label">
                  <span className="hero-brand-label-name">{slot.label}</span>
                  <span className="hero-brand-label-cta">查看</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* 移动：横滑货架 */}
        <div className="hero-brand-rail" role="list">
          {HERO_BRAND_SLOTS.map((slot, i) => (
            <Link
              key={`hero-brand-rail-${i}`}
              href={resolveBrandHref(products, slot)}
              role="listitem"
              className="hero-brand-rail-card"
              aria-label={`${slot.alt} — 查看商品`}
            >
              <div className="hero-brand-rail-frame">
                <HeroBrandImage src={slot.src} alt={slot.alt} priority={i <= 1} />
              </div>
              <span className="hero-brand-rail-label">{slot.label}</span>
            </Link>
          ))}
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
