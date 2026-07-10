"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageGallery({
  images,
  name,
  soldOut = false,
  soldOutLabel = "售罄",
}: {
  images: string;
  name: string;
  soldOut?: boolean;
  soldOutLabel?: string;
}) {
  const list = images
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [selected, setSelected] = useState(0);
  const current = list[selected] || "/products/placeholder.svg";

  function goPrev() {
    setSelected((i) => (i - 1 + Math.max(list.length, 1)) % Math.max(list.length, 1));
  }

  function goNext() {
    setSelected((i) => (i + 1) % Math.max(list.length, 1));
  }

  const thumbs = list.length > 1 ? (
    <>
      {list.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSelected(i)}
          className={`product-gallery-thumb ${i === selected ? "is-active" : ""}`}
          aria-label={`${name} ${i + 1}`}
          aria-current={i === selected ? "true" : undefined}
        >
          <Image
            src={img}
            alt=""
            fill
            unoptimized={img.endsWith(".svg")}
            className="object-contain p-1"
            sizes="72px"
          />
        </button>
      ))}
    </>
  ) : null;

  return (
    <div className="product-gallery">
      {thumbs ? <div className="product-gallery-thumbs-desktop">{thumbs}</div> : null}

      <div className="product-gallery-main">
        <div className="product-gallery-stage">
          <Image
            src={current}
            alt={name}
            fill
            unoptimized={current.endsWith(".svg")}
            sizes="(max-width: 1023px) 100vw, 48vw"
            className="object-contain p-4 sm:p-6"
            priority
          />

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
              <span className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-4 py-1.5 text-sm font-semibold text-[#6b7280]">
                {soldOutLabel}
              </span>
            </div>
          )}

          {list.length > 1 && (
            <div className="product-gallery-nav">
              <button type="button" onClick={goPrev} className="product-gallery-nav-btn" aria-label="上一张">
                ‹
              </button>
              <button type="button" onClick={goNext} className="product-gallery-nav-btn" aria-label="下一张">
                ›
              </button>
            </div>
          )}
        </div>

        {thumbs ? <div className="product-gallery-thumbs-mobile">{thumbs}</div> : null}
      </div>
    </div>
  );
}
