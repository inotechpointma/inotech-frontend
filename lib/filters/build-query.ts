import type { ProductQueryFilters } from "@/lib/woocommerce/types";

const ORDERBY_MAP: Record<NonNullable<ProductQueryFilters["orderby"]>, { orderby: string; order: "asc" | "desc" }> = {
  date: { orderby: "date", order: "desc" },
  price: { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  popularity: { orderby: "popularity", order: "desc" },
  rating: { orderby: "rating", order: "desc" },
  title: { orderby: "title", order: "asc" },
};

/** Converts a typed filter object into WooCommerce REST /products query args. */
export function buildProductQuery(filters: ProductQueryFilters): Record<string, string | number | boolean | undefined> {
  const { orderby, order } = ORDERBY_MAP[filters.orderby ?? "date"];

  const query: Record<string, string | number | boolean | undefined> = {
    page: filters.page ?? 1,
    per_page: filters.perPage ?? 24,
    orderby,
    order,
    category: filters.category,
    tag: undefined,
    search: filters.search,
    min_price: filters.priceMin,
    max_price: filters.priceMax,
    featured: filters.featured || undefined,
    on_sale: filters.onSale || undefined,
    status: "publish",
  };

  if (filters.brand) {
    query["product_brand"] = filters.brand;
  }

  if (filters.tag) {
    query["tag_slug"] = filters.tag;
  }

  if (filters.attributes) {
    // WooCommerce REST supports one attribute/attribute_term pair natively; for multiple
    // simultaneous attribute facets we fetch broader and post-filter in products.ts.
    const [firstKey, firstValues] = Object.entries(filters.attributes)[0] ?? [];
    if (firstKey && firstValues?.length) {
      query["attribute"] = firstKey;
      query["attribute_term"] = firstValues.join(",");
    }
  }

  return query;
}
