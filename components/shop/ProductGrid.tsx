import { ProductCard } from "@/components/shop/ProductCard";
import type { WCProduct } from "@/lib/woocommerce/types";

export function ProductGrid({ products }: { products: WCProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="section-title-row" style={{ justifyContent: "center", color: "var(--muted)" }}>
        Aucun produit ne correspond à ces critères.
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
