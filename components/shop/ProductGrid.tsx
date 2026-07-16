import { ProductCard } from "@/components/shop/ProductCard";
import type { WCProduct } from "@/lib/woocommerce/types";

export function ProductGrid({ products }: { products: WCProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded border border-dashed border-border/30 text-ink-muted">
        Aucun produit ne correspond à ces critères.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
