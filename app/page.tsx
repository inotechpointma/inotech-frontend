import { getCategoryTree } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";
import { getProducts } from "@/lib/woocommerce/products";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default async function HomePage() {
  const [categories, brands, popular, bestSellers] = await Promise.all([
    getCategoryTree().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ featured: true, perPage: 10 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
    getProducts({ orderby: "popularity", perPage: 10 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
  ]);

  return (
    <>
      <Hero />
      <CategoryShowcase categories={categories} />

      {popular.products.length > 0 ? (
        <section className="container py-12">
          <h2 className="mb-6 text-xl font-bold">Produits Populaire</h2>
          <ProductGrid products={popular.products} />
        </section>
      ) : null}

      <BrandStrip brands={brands} />

      {bestSellers.products.length > 0 ? (
        <section className="container py-12">
          <h2 className="mb-6 text-xl font-bold">Meilleures ventes</h2>
          <ProductGrid products={bestSellers.products} />
        </section>
      ) : null}
    </>
  );
}
