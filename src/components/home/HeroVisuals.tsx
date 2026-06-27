"use client";

import Image from "next/image";
import {
  BoxPlaceholder,
  CardPlaceholder,
  PsaSlabPlaceholder,
} from "@/components/HeroPlaceholders";
import type { HeroStackProduct } from "@/components/HomeHero";

const STACK = [
  { r: -14, x: -72, y: 20, z: 1, bg: "linear-gradient(135deg,#EAF4FF,#fff)" },
  { r: -6, x: -28, y: -6, z: 2, bg: "linear-gradient(135deg,#F3EEFF,#fff)" },
  { r: 0, x: 0, y: 0, z: 4, bg: "linear-gradient(135deg,#FFF7D6,#fff)" },
  { r: 7, x: 32, y: -10, z: 3, bg: "linear-gradient(135deg,#FFF0F5,#fff)" },
  { r: 13, x: 68, y: 18, z: 2, bg: "linear-gradient(135deg,#EAF4FF,#FFF0F5)" },
];

const HERO_BRAND_SLOTS: ({ src: string; alt: string } | null)[] = [
  null,
  { src: "/images/hero-pack-gengar.jpg", alt: "宝可梦 宝石包 VOL.3" },
  { src: "/images/hero-pack-stellar-crown.jpg", alt: "宝可梦 星彩晶璃" },
  { src: "/images/hero-pack-terastal.jpg", alt: "宝可梦 太晶盛聚" },
  null,
];

export function HeroBrandVisual(_props: { products: HeroStackProduct[] }) {
  return (
    <div className="hero-v2-visual hero-float-group relative mx-auto h-[220px] w-full max-w-[420px] sm:h-[260px] lg:h-[320px] lg:max-w-[480px]">
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
                  {slot ? (
                    <Image
                      src={slot.src}
                      alt={slot.alt}
                      fill
                      sizes="130px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <CardPlaceholder />
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

function ShipBoxPlaceholder() {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-[16px] bg-[#f8fafc]" aria-hidden>
      <div className="relative h-[70%] w-[78%] rounded-lg border border-[rgba(15,23,42,0.1)] bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-x-3 top-3 h-2 rounded bg-[#111827]/15" />
        <div className="absolute bottom-4 left-1/2 h-1 w-12 -translate-x-1/2 rounded bg-[#111827]/10" />
      </div>
    </div>
  );
}

export function HeroB2BVisual() {
  return (
    <div className="hero-v2-visual hero-float-group relative mx-auto h-[220px] w-full max-w-[400px] sm:h-[260px] lg:h-[300px]">
      <div className="hero-float-slow absolute left-[4%] top-[10%] w-[36%]">
        <div className="rounded-[20px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm">
          <BoxPlaceholder />
        </div>
      </div>
      <div className="hero-float-delay absolute right-[2%] top-[14%] w-[34%]">
        <div className="rounded-[20px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm">
          <PsaSlabPlaceholder />
        </div>
      </div>
      <div className="hero-float-slow absolute bottom-[6%] left-[18%] w-[32%]">
        <div className="rounded-[18px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <CardPlaceholder />
        </div>
      </div>
      <div className="hero-float-delay absolute bottom-[10%] right-[12%] w-[38%]">
        <div className="rounded-[20px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <ShipBoxPlaceholder />
        </div>
      </div>
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
