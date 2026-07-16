"use client";

const STORAGE_KEY = "inotech:wishlist";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string | null;
}

function read(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: WishlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("inotech:wishlist-change"));
}

export function getWishlist(): WishlistItem[] {
  return read();
}

export function isInWishlist(id: number): boolean {
  return read().some((item) => item.id === id);
}

export function toggleWishlist(item: WishlistItem): boolean {
  const items = read();
  const exists = items.some((i) => i.id === item.id);
  const next = exists ? items.filter((i) => i.id !== item.id) : [...items, item];
  write(next);
  return !exists;
}
