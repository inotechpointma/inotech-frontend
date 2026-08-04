"use client";

import { useMemo, useState } from "react";
import { ProductPrice } from "@/components/product/ProductPrice";
import { StockBadge } from "@/components/product/StockBadge";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import type { WCProduct, WCVariation } from "@/lib/woocommerce/types";

const TRUST_ITEMS = [
  {
    title: "Livraison nationale",
    description: "Expédition et suivi de commande partout au Maroc.",
    icon: (
      <>
        <path d="M3 6h13v11H3zM16 10h3l2 3v4h-5z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
  },
  {
    title: "Produits garantis",
    description: "Des références sélectionnées avec une garantie clairement indiquée.",
    icon: (
      <>
        <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];


export function ProductInfo({ product, variations }: { product: WCProduct; variations: WCVariation[] }) {
  const [selected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const matchedVariation = useMemo(() => {
    if (product.type !== "variable" || variations.length === 0) return null;
    return (
      variations.find((variation) =>
        variation.attributes.every((attr) => selected[attr.name] === attr.option || !selected[attr.name]),
      ) ?? null
    );
  }, [selected, variations, product.type]);

  const price = matchedVariation?.price || product.price;
  const regularPrice = matchedVariation?.regular_price || product.regular_price;
  const onSale = matchedVariation?.on_sale ?? product.on_sale;
  const stockStatus = matchedVariation?.stock_status ?? product.stock_status;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.sku ? <p className="mt-1 text-sm text-ink-muted">Réf. {product.sku}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <ProductPrice price={price} regularPrice={regularPrice} onSale={onSale} size="lg" />
        <StockBadge status={stockStatus} />
      </div>

      {product.short_description ? (
        <div
          className="prose prose-sm max-w-none text-ink-muted"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      ) : null}

{/* 
        <VariationSelector attributes={product.attributes} selected={selected} onSelect={(name, option) => setSelected((prev) => ({ ...prev, [name]: option }))} />
 */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span>Quantité</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded border border-border/30 px-2 py-1.5"
          />
        </label>
      </div>

      <section className="section">
        <div className="flex flex-col gap-4 rounded-lg border border-border/15 p-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand/10">
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20 }} className="fill-brand">
                    {item.icon}
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-brand">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
      </section>
    
      

      <WhatsAppButton 
        product={product}
        variation={matchedVariation}
        quantity={quantity}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-brand font-semibold text-white hover:opacity-90 sm:w-auto sm:px-8"
      />
    </div>
  );
}
