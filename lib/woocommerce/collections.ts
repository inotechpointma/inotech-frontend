import { wpFetch } from "./client";
import { getProductsByIds } from "./products";
import type { WCProduct } from "./types";

/**
 * Curated collections (e.g. "Back to School") are modeled as a `collection` custom post type
 * in WordPress (wp/v2/collection) carrying an ACF/meta field `product_ids` (comma-separated
 * WooCommerce product IDs). This keeps curation editorial (a WP admin picks products) rather
 * than data-driven like categories/brands/tags.
 */
export interface WPCollection {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  meta?: { product_ids?: string };
}

export async function getCollectionBySlug(slug: string): Promise<WPCollection | null> {
  const { data } = await wpFetch<WPCollection[]>("/collection", { slug }, { tags: ["collections"] });
  return data[0] ?? null;
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  try {
    const { data } = await wpFetch<WPCollection[]>("/collection", { per_page: 100, _fields: "slug" }, {
      tags: ["collections"],
    });
    return data.map((c) => c.slug);
  } catch {
    return [];
  }
}

export async function getCollectionProducts(collection: WPCollection): Promise<WCProduct[]> {
  const ids = collection.meta?.product_ids
    ?.split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id));
  if (!ids?.length) return [];

  return getProductsByIds(ids);
}
