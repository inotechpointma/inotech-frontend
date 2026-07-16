import type { ProductQueryFilters } from "@/lib/woocommerce/types";

export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const VALID_ORDERBY = new Set(["date", "price", "price-desc", "popularity", "rating", "title"]);

/**
 * Parses the URL search params shared across shop/category/brand/tag pages into a typed
 * filter object. This is the single source of truth for which query keys drive filtering:
 *   ?orderby=price&price_min=3000&price_max=12000&brand=hp,lenovo&pa_socket=am5&pa_ram=16-go
 */
export function parseSearchParams(searchParams: SearchParams): ProductQueryFilters {
  const orderbyRaw = first(searchParams.orderby);
  const orderby = orderbyRaw && VALID_ORDERBY.has(orderbyRaw) ? (orderbyRaw as ProductQueryFilters["orderby"]) : undefined;

  const priceMin = first(searchParams.price_min);
  const priceMax = first(searchParams.price_max);
  const page = first(searchParams.page);

  const attributes: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (!key.startsWith("pa_") || !value) continue;
    attributes[key] = (Array.isArray(value) ? value : value.split(",")).filter(Boolean);
  }

  return {
    page: page ? Number(page) : undefined,
    orderby,
    brand: first(searchParams.brand),
    tag: first(searchParams.tag),
    search: first(searchParams.q ?? searchParams.search),
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    attributes: Object.keys(attributes).length ? attributes : undefined,
    featured: first(searchParams.featured) === "1",
    onSale: first(searchParams.on_sale) === "1",
  };
}
