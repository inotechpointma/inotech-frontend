import { getCategoryTree } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";
import { getProducts, getProductsByTag } from "@/lib/woocommerce/products";
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
  const [categories, brands, essentials, popular, gamingProducts, commeNeufProducts, newProducts] = await Promise.all([
    getCategoryTree().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ featured: true, perPage: 6 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
    getProducts({ orderby: "popularity", perPage: 6 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
    await getProductsByTag("gaming", 4),
    await getProductsByTag("bon-occasion", 6),
    await getProductsByTag("nouveau", 6),
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

      <CampaignSection
        id="gaming"
        title="Gaming"
        subtitle="Des configurations pensées pour la performance."
        products={gamingProducts}
        campaign={{
          eyebrow: "Sélection Inotech",
          title: "Jouez sans compromis.",
          description:
            "PC portables et de bureau taillés pour le gaming, sélectionnés selon leur puissance et leur rapport qualité-prix.",
          cta: { label: "Explorer le gaming", href: "/shop?tag=gaming" },
          image: {
            src: "/hero/popular.png",
            alt: "Setup gaming avec PC et périphériques",
          },
        }}
      />

      <ProductSection
        id="Comme Neuf"
        title="Commencez à travailler avec du matériel reconditionné"
        subtitle="Des produits performants, remis à neuf et garantis, pour un usage professionnel ou personnel."
        viewMoreHref="/shop"
        products={commeNeufProducts}
      />

      <ProductSection
        id="new"
        title="Nouveautés"
        subtitle="Découvrez les dernières arrivées dans notre catalogue."
        viewMoreHref="/shop"
        products={newProducts}
      />

      <TrustSection id="trust" />

      <SeoSection />
    </>
  );
}
