"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { brandHref } from "@/lib/utils/slug";
import type { WCBrand } from "@/lib/woocommerce/types";

export function BrandStrip({ brands }: { brands: WCBrand[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start", skipSnaps: true },
    [AutoScroll({ speed: 0.8, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) autoScroll.stop();
  }, [emblaApi]);

  if (brands.length === 0) return null;

  const marqueeBrands = brands.length < 10 ? [...brands, ...brands] : brands;

  return (
    <section className="section" id="brands">
      <div className="container">
        <div className="section-title-row">
          <div>
            <h2>Acheter par marque</h2>
            <p>Retrouvez les références des fabricants les plus demandés.</p>
          </div>
        </div>

        <div className="brand-marquee">
          <div className="brand-marquee-viewport" ref={emblaRef}>
            <div className="brand-marquee-track">
              {marqueeBrands.map((brand, i) => (
                <div className="brand-marquee-slide" key={`${brand.id}-${i}`}>
                  <Link className="brand-chip" href={brandHref(brand.slug)} aria-label={brand.name}>
                    {brand.image ? (
                      <Image src={brand.image.src} alt={brand.name} width={130} height={60} />
                    ) : (
                      brand.name
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="brand-marquee-fade brand-marquee-fade-left" aria-hidden="true" />
          <div className="brand-marquee-fade brand-marquee-fade-right" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}