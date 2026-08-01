"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { WCImage } from "@/lib/woocommerce/types";

export function ProductGallery({ images, productName }: { images: WCImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+var(--nav-h)+1.5rem)]">
  <div className="relative aspect-[4/3] overflow-hidden rounded border border-border/15 bg-white">
    {active ? (
      <Image
        src={active.src}
        alt={active.alt || productName}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        className="object-contain p-6"
      />
    ) : null}
  </div>

  {images.length > 1 ? (
    <div className="flex gap-2 overflow-x-auto">
      {images.map((image, index) => (
        <button
          key={image.id}
          type="button"
          onClick={() => setActiveIndex(index)}
          aria-label={`Voir l'image ${index + 1}`}
          className={cn(
            "relative h-16 w-16 shrink-0 overflow-hidden rounded border",
            index === activeIndex ? "border-brand" : "border-border/20",
          )}
        >
          <Image src={image.src} alt={image.alt || productName} fill sizes="64px" className="object-contain p-1" />
        </button>
      ))}
    </div>
  ) : null}
</div>
  );
}
