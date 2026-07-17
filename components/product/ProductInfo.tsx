"use client";

import { useMemo, useState } from "react";
import { ProductPrice } from "@/components/product/ProductPrice";
import { StockBadge } from "@/components/product/StockBadge";
import { VariationSelector } from "@/components/product/VariationSelector";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import type { WCProduct, WCVariation } from "@/lib/woocommerce/types";

export function ProductInfo({ product, variations }: { product: WCProduct; variations: WCVariation[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
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

      <VariationSelector attributes={product.attributes} selected={selected} onSelect={(name, option) => setSelected((prev) => ({ ...prev, [name]: option }))} />

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

      <WhatsAppButton
        product={product}
        variation={matchedVariation}
        quantity={quantity}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-whatsapp font-semibold text-white hover:opacity-90 sm:w-auto sm:px-8"
      />
    </div>
  );
}
