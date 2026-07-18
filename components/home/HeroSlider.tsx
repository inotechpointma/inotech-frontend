"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: { src: string; alt: string };
}

/** Config-driven carousel — editorial content only, no Woo data. Autoplay pauses on
 * hover/focus and is skipped entirely under prefers-reduced-motion. */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduceMotion.current || slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <div
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Promotions principales"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <article key={slide.title} className={`hero-slide ${i === index ? "active" : ""}`} aria-hidden={i !== index}>
          <div className="hero-copy">
            <span className="eyebrow">{slide.eyebrow}</span>
            {i === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
            <p>{slide.description}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={slide.primaryCta.href}>
                {slide.primaryCta.label}
              </Link>
              <Link className="btn btn-secondary" href={slide.secondaryCta.href}>
                {slide.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Image src={slide.image.src} alt={slide.image.alt} width={720} height={520} priority={i === 0} />
          </div>
        </article>
      ))}

      <div className="hero-controls" aria-label="Navigation du carrousel">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            className={`hero-dot ${i === index ? "active" : ""}`}
            aria-label={`Afficher la diapositive ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
