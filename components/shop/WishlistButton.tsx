"use client";

import { useEffect, useState } from "react";
import { isInWishlist, toggleWishlist, type WishlistItem } from "@/lib/wishlist/storage";
import { cn } from "@/lib/utils/cn";

export function WishlistButton({ item, className }: { item: WishlistItem; className?: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInWishlist(item.id));
  }, [item.id]);

  return (
    <button
      type="button"
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        setActive(toggleWishlist(item));
      }}
      className={cn("icon-button wishlist", active && "active", className)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    </button>
  );
}
