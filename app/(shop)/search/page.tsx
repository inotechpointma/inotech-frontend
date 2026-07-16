import type { Metadata } from "next";
import { getProducts } from "@/lib/woocommerce/products";
import { parseSearchParams, type SearchParams } from "@/lib/filters/parse-search-params";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

export const metadata: Metadata = { title: "Résultats de recherche" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);
  const query = filters.search ?? "";

  const { products, total, totalPages } = query
    ? await getProducts(filters)
    : { products: [], total: 0, totalPages: 0 };

  const currentPage = filters.page ?? 1;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Recherche</h1>
      <p className="mb-6 text-sm text-ink-muted">
        {query ? (
          <>
            {total} résultat{total > 1 ? "s" : ""} pour « {query} »
          </>
        ) : (
          "Saisissez un terme de recherche."
        )}
      </p>

      <ProductGrid products={products} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(page) => `/search?q=${encodeURIComponent(query)}&page=${page}`}
      />
    </div>
  );
}
