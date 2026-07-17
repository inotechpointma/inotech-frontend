import { wooFetch } from "./client";
import { useFixtures } from "./config";
import { FIXTURE_BRANDS } from "./fixtures";
import type { WCBrand } from "./types";

/**
 * WooCommerce's native `product_brand` taxonomy (shipped in core since WC 9.x) exposes
 * /wc/v3/products/brands with the same shape as /products/categories minus parent/menu_order.
 * If the store instead uses a third-party brands plugin with a different REST namespace,
 * only this file needs to change.
 */
const LIST_PARAMS = { per_page: 100, hide_empty: false } as const;

export async function getBrands(): Promise<WCBrand[]> {
  if (useFixtures) return FIXTURE_BRANDS;

  const { data } = await wooFetch<WCBrand[]>("/products/brands", LIST_PARAMS, {
    tags: ["brands"],
  });
  return data;
}

export async function getBrandBySlug(slug: string): Promise<WCBrand | null> {
  if (useFixtures) return FIXTURE_BRANDS.find((b) => b.slug === slug) ?? null;

  const { data } = await wooFetch<WCBrand[]>(
    "/products/brands",
    { slug, hide_empty: false },
    { tags: ["brands"] },
  );
  return data[0] ?? null;
}
