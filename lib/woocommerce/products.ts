import { wooFetch } from "./client";
import { useFixtures } from "./config";
import { FIXTURE_PRODUCTS, FIXTURE_VARIATIONS } from "./fixtures";
import { buildProductQuery } from "@/lib/filters/build-query";
import { attributeSlugFromName } from "@/lib/utils/slug";
import { getTagBySlug } from "./tags";
import type { ProductQueryFilters, ProductQueryResult, WCProduct, WCVariation } from "./types";

function matchesFixtureFilters(product: WCProduct, filters: ProductQueryFilters): boolean {
  if (filters.category && !product.categories.some((c) => c.id === filters.category)) return false;
  if (filters.brand && !product.brands?.some((b) => b.slug === filters.brand)) return false;
  if (filters.tag && !product.tags.some((t) => t.slug === filters.tag)) return false;
  if (filters.featured && !product.featured) return false;
  if (filters.onSale && !product.on_sale) return false;
  if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;

  const price = Number(product.price);
  if (filters.priceMin !== undefined && price < filters.priceMin) return false;
  if (filters.priceMax !== undefined && price > filters.priceMax) return false;

  if (filters.attributes) {
    for (const [attrSlug, values] of Object.entries(filters.attributes)) {
      const attr = product.attributes.find((a) => attributeSlugFromName(a.name) === attrSlug);
      if (!attr || !attr.options.some((option) => values.includes(option))) return false;
    }
  }

  return true;
}

function sortFixtureProducts(products: WCProduct[], orderby: ProductQueryFilters["orderby"]): WCProduct[] {
  const sorted = [...products];
  switch (orderby) {
    case "price":
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    case "price-desc":
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    case "rating":
      return sorted.sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
    case "popularity":
      return sorted.sort((a, b) => b.rating_count - a.rating_count);
    case "title":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort((a, b) => b.id - a.id);
  }
}

function getFixtureProducts(filters: ProductQueryFilters): ProductQueryResult {
  const matched = FIXTURE_PRODUCTS.filter((p) => matchesFixtureFilters(p, filters));
  const sorted = sortFixtureProducts(matched, filters.orderby);

  const perPage = filters.perPage ?? 24;
  const page = filters.page ?? 1;
  const start = (page - 1) * perPage;
  const products = sorted.slice(start, start + perPage);

  return { products, total: sorted.length, totalPages: Math.ceil(sorted.length / perPage) || 1 };
}

export async function getProducts(filters: ProductQueryFilters = {}): Promise<ProductQueryResult> {
  if (useFixtures) return getFixtureProducts(filters);

  const query = buildProductQuery(filters);
  const { data, total, totalPages } = await wooFetch<WCProduct[]>("/products", query, {
    tags: ["products"],
  });
  return { products: data, total, totalPages };
}

export async function getProductsByCategory(
  categoryId: number,
  filters: ProductQueryFilters = {},
): Promise<ProductQueryResult> {
  return getProducts({ ...filters, category: categoryId });
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  if (useFixtures) return FIXTURE_PRODUCTS.find((p) => p.slug === slug) ?? null;

  const { data } = await wooFetch<WCProduct[]>("/products", { slug }, { tags: ["products"] });
  const product = data[0] ?? null;
  return product;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  if (useFixtures) return FIXTURE_PRODUCTS.find((p) => p.id === id) ?? null;

  try {
    const { data } = await wooFetch<WCProduct>(`/products/${id}`, {}, {
      tags: ["products", `product:${id}`],
    });
    return data;
  } catch {
    return null;
  }
}

export async function getProductVariations(productId: number): Promise<WCVariation[]> {
  if (useFixtures) return FIXTURE_VARIATIONS[productId] ?? [];

  const { data } = await wooFetch<WCVariation[]>(
    `/products/${productId}/variations`,
    { per_page: 100 },
    { tags: [`product:${productId}`] },
  );
  return data;
}

export async function getRelatedProducts(product: WCProduct, limit = 8): Promise<WCProduct[]> {
  if (!product.related_ids.length) return [];
  return getProductsByIds(product.related_ids.slice(0, limit));
}

export async function getProductsByIds(ids: number[]): Promise<WCProduct[]> {
  if (ids.length === 0) return [];

  if (useFixtures) {
    const idSet = new Set(ids);
    return FIXTURE_PRODUCTS.filter((p) => idSet.has(p.id));
  }

  const { data } = await wooFetch<WCProduct[]>(
    "/products",
    { include: ids.join(","), per_page: ids.length },
    { tags: ["products"] },
  );
  return data;
}

/** All known product slugs — used by generateStaticParams for /product/[slug]. */
export async function getAllProductSlugs(limit = 200): Promise<string[]> {
  if (useFixtures) return FIXTURE_PRODUCTS.map((p) => p.slug);

  const perPage = 100; // WooCommerce hard max — never exceed this
  const slugs: string[] = [];
  let page = 1;

  while (slugs.length < limit) {
    const { data } = await wooFetch<WCProduct[]>(
      "/products",
      {
        per_page: Math.min(perPage, limit - slugs.length),
        page,
        status: "publish",
        _fields: "slug",
      },
      { tags: ["products"] },
    );

    slugs.push(...data.map((p) => p.slug));

    // last page reached — WooCommerce returned fewer items than requested
    if (data.length < perPage) break;

    page++;
  }

  return slugs;
}

/**
 * Fetches products belonging to a single tag, resolved by slug.
 * Used for homepage sections like "Gaming" that pull from one tag only.
 */
export async function getProductsByTag(
  tagSlug: string,
  perPage = 6,
): Promise<WCProduct[]> {
  if (useFixtures) {
    return FIXTURE_PRODUCTS
      .filter((p) => p.tags.some((t) => t.slug === tagSlug))
      .slice(0, perPage);
  }

  const tag = await getTagBySlug(tagSlug);
  if (!tag) return [];

  const { data } = await wooFetch<WCProduct[]>(
    "/products",
    { tag: tag.id, per_page: perPage, status: "publish" },
    { tags: ["products", `tag:${tag.id}`] },
  );
  return data;
}