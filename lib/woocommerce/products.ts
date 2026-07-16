import { wooFetch } from "./client";
import { buildProductQuery } from "@/lib/filters/build-query";
import type { ProductQueryFilters, ProductQueryResult, WCProduct, WCVariation } from "./types";

export async function getProducts(filters: ProductQueryFilters = {}): Promise<ProductQueryResult> {
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
  const { data } = await wooFetch<WCProduct[]>("/products", { slug }, { tags: ["products"] });
  const product = data[0] ?? null;
  return product;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
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
  const { data } = await wooFetch<WCProduct[]>(
    "/products",
    { include: ids.join(","), per_page: ids.length },
    { tags: ["products"] },
  );
  return data;
}

/** All known product slugs — used by generateStaticParams for /product/[slug]. */
export async function getAllProductSlugs(limit = 200): Promise<string[]> {
  const { data } = await wooFetch<WCProduct[]>(
    "/products",
    { per_page: limit, status: "publish", _fields: "slug" },
    { tags: ["products"] },
  );
  return data.map((p) => p.slug);
}
