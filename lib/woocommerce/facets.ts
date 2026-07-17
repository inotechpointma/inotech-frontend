import { getProducts } from "./products";
import { getConfiguredAttributesForCategory } from "@/lib/filters/facet-config";
import { attributeSlugFromName } from "@/lib/utils/slug";
import type { ProductQueryFilters, ResolvedFacets, WCProduct } from "./types";

export interface FacetScope {
  category?: { id: number; slug: string };
  brand?: string;
  tag?: string;
}

function priceOf(product: WCProduct): number {
  const value = Number(product.price || product.regular_price || 0);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Resolves the facets (brands, price range, attributes) that actually exist for a given scope
 * (category / brand / tag), combining:
 *  - data-driven aggregation: distinct brands/attribute terms present on the products in scope
 *  - config-driven narrowing: lib/filters/facet-config.ts restricts which attributes surface
 *    per-category, so a motherboard listing doesn't show "Battery Capacity".
 * Sampled over a bounded product set (up to 100) rather than the whole catalog, which keeps this
 * fast and is more than enough to represent what's meaningfully filterable in a category branch.
 */
export async function resolveFacets(scope: FacetScope): Promise<ResolvedFacets> {
  const filters: ProductQueryFilters = {
    category: scope.category?.id,
    brand: scope.brand,
    tag: scope.tag,
    perPage: 100,
  };

  const { products } = await getProducts(filters);

  let min = Infinity;
  let max = 0;
  const brandCounts = new Map<string, { name: string; count: number }>();
  const attributeCounts = new Map<string, { label: string; terms: Map<string, number> }>();

  const allowedAttrSlugs = scope.category ? getConfiguredAttributesForCategory(scope.category.slug) : null;

  for (const product of products) {
    const price = priceOf(product);
    if (price > 0) {
      min = Math.min(min, price);
      max = Math.max(max, price);
    }

    for (const brand of product.brands ?? []) {
      const existing = brandCounts.get(brand.slug);
      brandCounts.set(brand.slug, { name: brand.name, count: (existing?.count ?? 0) + 1 });
    }

    for (const attr of product.attributes) {
      if (!attr.visible) continue;
      const slug = attributeSlugFromName(attr.name);
      if (allowedAttrSlugs && !allowedAttrSlugs.includes(slug)) continue;

      const bucket = attributeCounts.get(slug) ?? { label: attr.name, terms: new Map<string, number>() };
      for (const option of attr.options) {
        bucket.terms.set(option, (bucket.terms.get(option) ?? 0) + 1);
      }
      attributeCounts.set(slug, bucket);
    }
  }

  return {
    priceRange: { min: Number.isFinite(min) ? min : 0, max },
    brands: [...brandCounts.entries()]
      .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
      .sort((a, b) => b.count - a.count),
    attributes: [...attributeCounts.entries()]
      .map(([key, v]) => ({
        key,
        label: v.label,
        terms: [...v.terms.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}
