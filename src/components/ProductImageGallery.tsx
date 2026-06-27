"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageGallery({
  images,
  name,
}: {
  images: string;
  name: string;
}) {
  const list = images
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [selected, setSelected] = useState(0);
  const current = list[selected] || "/products/placeholder.svg";

  return (
    <div className="space-y-3">
      <div className="surface relative aspect-[5/7] overflow-hidden">
        <Image
          src={current}
          alt={name}
          fill
          unoptimized={current.endsWith(".svg")}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border transition ${
                i === selected
                  ? "border-cyan-400"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                unoptimized={img.endsWith(".svg")}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
