import type { Metadata } from "next";
import { getProducts } from "@/lib/woocommerce/products";
import { resolveFacets } from "@/lib/woocommerce/facets";
import { parseSearchParams, type SearchParams } from "@/lib/filters/parse-search-params";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ResultsHeader } from "@/components/shop/ResultsHeader";
import { Pagination } from "@/components/shop/Pagination";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Tous nos PC portables, composants et accessoires informatiques.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);

  const [{ products, total, totalPages }, facets] = await Promise.all([
    getProducts(filters),
    resolveFacets({}),
  ]);

  const currentPage = filters.page ?? 1;
  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams).flatMap(([k, v]) => (v && k !== "page" ? [[k, String(v)]] : [])),
  ).toString();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Boutique</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <FiltersSidebar facets={facets} />
        </div>

        <div>
          <ActiveFilters />
          <ResultsHeader total={total} facets={facets} />
          <ProductGrid products={products} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={(page) => `/shop?${queryString ? `${queryString}&` : ""}page=${page}`}
          />
        </div>
      </div>
    </div>
  );
}
