import { getCategoryTree } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";
import { getProducts } from "@/lib/woocommerce/products";
import { Hero } from "@/components/home/Hero";
import { UspRow } from "@/components/home/UspRow";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default async function HomePage() {
  const [categories, brands, featured, bestSellers] = await Promise.all([
    getCategoryTree().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ featured: true, perPage: 8 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
    getProducts({ orderby: "popularity", perPage: 8 }).catch(() => ({ products: [], total: 0, totalPages: 0 })),
  ]);

  return (
    <>
      <Hero />
      <UspRow />
      <CategoryShowcase categories={categories} />

      {featured.products.length > 0 ? (
        <section className="container py-12">
          <h2 className="mb-6 text-xl font-bold">Produits en vedette</h2>
          <ProductGrid products={featured.products} />
        </section>
      ) : null}

      {bestSellers.products.length > 0 ? (
        <section className="container py-12">
          <h2 className="mb-6 text-xl font-bold">Meilleures ventes</h2>
          <ProductGrid products={bestSellers.products} />
        </section>
      ) : null}

      <BrandStrip brands={brands} />
    </>
  );
}
