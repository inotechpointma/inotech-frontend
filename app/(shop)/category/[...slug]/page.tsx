import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategoryPaths, getCategoryByPath } from "@/lib/woocommerce/categories";
import { getProducts } from "@/lib/woocommerce/products";
import { resolveFacets } from "@/lib/woocommerce/facets";
import { parseSearchParams, type SearchParams } from "@/lib/filters/parse-search-params";
import { categoryMetadata } from "@/lib/seo/metadata";
import { categoryHref } from "@/lib/utils/slug";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { SubcategoryGrid } from "@/components/category/SubcategoryGrid";
import { CategoryEmptyState } from "@/components/category/CategoryEmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { ResultsHeader } from "@/components/shop/ResultsHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const paths = await getAllCategoryPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryByPath(slug);
  if (!category) return {};
  return categoryMetadata(category.name, category.description, category.path);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryByPath(slug);

  if (!category) notFound();

  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);

  const [{ products, total, totalPages }, facets] = await Promise.all([
    getProducts({ ...filters, category: category.id }),
    resolveFacets({ category: { id: category.id, slug: category.slug } }),
  ]);

  const currentPage = filters.page ?? 1;
  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams).flatMap(([k, v]) => (v && k !== "page" ? [[k, String(v)]] : [])),
  ).toString();
  const href = categoryHref(category.path);

  const breadcrumbItems = category.path.map((_, index) => {
    // We only have names for the final segment reliably; intermediate names come from the tree
    // walk performed inside getCategoryByPath, so re-derive labels from `category` itself when
    // this is the last segment, otherwise fall back to the slug.
    const isLast = index === category.path.length - 1;
    return {
      name: isLast ? category.name : category.path[index]!.replace(/-/g, " "),
      href: `/category/${category.path.slice(0, index + 1).join("/")}`,
    };
  });

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <CategoryHeader name={category.name} description={category.description} image={category.image?.src} />

      <SubcategoryGrid subcategories={category.children} />

      {category.children.length === 0 && products.length === 0 ? (
        <CategoryEmptyState />
      ) : (
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
              buildHref={(page) => `${href}?${queryString ? `${queryString}&` : ""}page=${page}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
