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
      aria-label={active ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        setActive(toggleWishlist(item));
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card",
        active && "text-brand",
        className,
      )}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
