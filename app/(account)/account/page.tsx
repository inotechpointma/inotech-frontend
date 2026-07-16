"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWishlist, toggleWishlist, type WishlistItem } from "@/lib/wishlist/storage";
import { ProductPrice } from "@/components/product/ProductPrice";
import { productHref } from "@/lib/utils/slug";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(getWishlist());
    refresh();
    window.addEventListener("inotech:wishlist-change", refresh);
    return () => window.removeEventListener("inotech:wishlist-change", refresh);
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Liste de souhaits</h1>

      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Votre liste de souhaits est vide. Ajoutez des produits en cliquant sur ♡ sur une fiche
          produit.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border/15">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-alt">
                {item.image ? <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" /> : null}
              </div>
              <Link href={productHref(item.slug)} className="flex-1 text-sm font-medium hover:text-brand">
                {item.name}
              </Link>
              <ProductPrice price={item.price} regularPrice={item.price} onSale={false} size="sm" />
              <button
                onClick={() => {
                  toggleWishlist(item);
                  setItems((prev) => prev.filter((i) => i.id !== item.id));
                }}
                aria-label="Retirer"
                className="text-ink-muted hover:text-brand"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
