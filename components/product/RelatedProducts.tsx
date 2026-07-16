import { ProductGrid } from "@/components/shop/ProductGrid";
import type { WCProduct } from "@/lib/woocommerce/types";

export function RelatedProducts({ products }: { products: WCProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold">Produits similaires</h2>
      <ProductGrid products={products} />
    </section>
  );
}
