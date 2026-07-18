"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { formatPrice } from "@/lib/utils/format-price";
import type { WCProduct } from "@/lib/woocommerce/types";

/**
 * "Aperçu rapide" — fed entirely by the product object ProductCard already received as a prop.
 * No new fetch/route: everything shown here is data already in hand.
 *
 * Rendered via a portal to document.body: the trigger button lives inside .product-actions,
 * which has a CSS transform applied (the hover-reveal slide) — a transformed ancestor becomes
 * the containing block for position:fixed descendants, so without the portal the dialog would
 * be sized/positioned relative to that small action rail instead of the viewport.
 */
export function ProductQuickView({ product }: { product: WCProduct }) {
  const [open, setOpen] = useState(false);
  const image = product.images[0];
  const available = product.stock_status === "instock";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="icon-button"
        aria-label="Aperçu rapide"
        title="Aperçu rapide"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={product.name}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            >
              <button
                aria-label="Fermer l'aperçu"
                className="absolute inset-0 cursor-default"
                style={{ background: "rgba(0,0,0,.6)" }}
                onClick={() => setOpen(false)}
              />
              <div
                className="relative grid w-full max-w-2xl grid-cols-1 gap-6 overflow-hidden bg-white p-6 sm:grid-cols-2"
                style={{ borderRadius: "var(--radius)" }}
              >
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="icon-button absolute right-4 top-4 z-10"
                  style={{ width: 36, height: 36 }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>

                <div
                  className="relative aspect-square overflow-hidden"
                  style={{ background: "var(--surface-soft)", borderRadius: "var(--radius)" }}
                >
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col gap-3">
                  {product.categories[0] ? <p className="product-category">{product.categories[0].name}</p> : null}
                  <h2 className="product-title" style={{ maxHeight: "none", WebkitLineClamp: "unset" }}>
                    {product.name}
                  </h2>
                  <div className="product-price" style={{ justifyContent: "flex-start" }}>
                    {product.on_sale && product.regular_price !== product.price ? (
                      <span className="old-price">{formatPrice(product.regular_price)}</span>
                    ) : null}
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  {product.short_description ? (
                    <div
                      className="text-sm"
                      style={{ color: "var(--body)" }}
                      dangerouslySetInnerHTML={{ __html: product.short_description }}
                    />
                  ) : null}

                  <div className="mt-auto pt-2">
                    {available ? (
                      <WhatsAppButton product={product} label="Commander sur WhatsApp" className="quick-add static" />
                    ) : (
                      <div className="quick-add unavailable static">
                        <span>Indisponible</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
