import { getCategoryTree } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";
import { getProducts } from "@/lib/woocommerce/products";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductSection } from "@/components/home/ProductSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { LifestyleSection } from "@/components/home/LifestyleSection";
import { TrustSection } from "@/components/home/TrustSection";
import { SeoSection } from "@/components/home/SeoSection";
import type { CategoryNode } from "@/lib/woocommerce/types";

function findCategoryBySlug(nodes: CategoryNode[], slug: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    const found = findCategoryBySlug(node.children, slug);
    if (found) return found;
  }
  return null;
}

export default async function HomePage() {
  const [categories, brands, essentials, popular] = await Promise.all([
    getCategoryTree().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ featured: true, perPage: 6 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
    getProducts({ orderby: "popularity", perPage: 5 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
  ]);

  const peripheriqueCategory = findCategoryBySlug(categories, "peripherique");
  const monitors = peripheriqueCategory
    ? await getProducts({ category: peripheriqueCategory.id, perPage: 6 }).catch(() => ({ products: [], total: 0, totalPages: 0 }))
    : await getProducts({ onSale: true, perPage: 6 }).catch(() => ({ products: [], total: 0, totalPages: 0 }));

  return (
    <>
      <Hero />

      <CategoryShowcase categories={categories} />

      <ProductSection
        id="gaming"
        title="Les essentiels du moment"
        subtitle="Une sélection de produits performants pour chaque usage."
        viewMoreHref="/shop"
        products={essentials.products}
      />

      <BrandStrip brands={brands} />

      <CampaignSection id="popular" title="Produits populaires" subtitle="Les références les plus consultées du catalogue." products={popular.products} />

      <LifestyleSection id="accessories" />

      <ProductSection
        id="monitors"
        title="Moniteurs & périphériques"
        subtitle="Pour le travail, la création, le divertissement et le gaming."
        viewMoreHref="/shop"
        products={monitors.products}
      />

      <TrustSection id="trust" />

      <SeoSection />
    </>
  );
}
