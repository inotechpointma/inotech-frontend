import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTagBySlug, getTags } from "@/lib/woocommerce/tags";
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

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return { title: tag.name, description: tag.description || `Produits taggés ${tag.name}.` };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);

  const [{ products, total, totalPages }, facets] = await Promise.all([
    getProducts({ ...filters, tag: tag.slug }),
    resolveFacets({ tag: tag.slug }),
  ]);

  const currentPage = filters.page ?? 1;
  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams).flatMap(([k, v]) => (v && k !== "page" ? [[k, String(v)]] : [])),
  ).toString();

  return (
    <div>
      <Breadcrumbs items={[{ name: tag.name, href: `/tag/${tag.slug}` }]} />
      <CategoryHeader name={tag.name} description={tag.description} />

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
            buildHref={(page) => `/tag/${tag.slug}?${queryString ? `${queryString}&` : ""}page=${page}`}
          />
        </div>
      </div>
    </div>
  );
}
