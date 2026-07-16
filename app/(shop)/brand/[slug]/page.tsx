import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug, getBrands } from "@/lib/woocommerce/brands";
import { getProducts } from "@/lib/woocommerce/products";
import { resolveFacets } from "@/lib/woocommerce/facets";
import { parseSearchParams, type SearchParams } from "@/lib/filters/parse-search-params";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { ResultsHeader } from "@/components/shop/ResultsHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return { title: brand.name, description: brand.description || `Tous les produits ${brand.name}.` };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);

  const [{ products, total, totalPages }, facets] = await Promise.all([
    getProducts({ ...filters, brand: brand.slug }),
    resolveFacets({ brand: brand.slug }),
  ]);

  const currentPage = filters.page ?? 1;
  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams).flatMap(([k, v]) => (v && k !== "page" ? [[k, String(v)]] : [])),
  ).toString();

  return (
    <div>
      <Breadcrumbs items={[{ name: brand.name, href: `/brand/${brand.slug}` }]} />
      <CategoryHeader name={brand.name} description={brand.description} image={brand.image?.src} />

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
            buildHref={(page) => `/brand/${brand.slug}?${queryString ? `${queryString}&` : ""}page=${page}`}
          />
        </div>
      </div>
    </div>
  );
}
