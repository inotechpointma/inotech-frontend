import Link from "next/link";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { WCProduct } from "@/lib/woocommerce/types";

export function ProductSection({
  id,
  title,
  subtitle,
  viewMoreHref,
  products,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  viewMoreHref?: string;
  products: WCProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="section" id={id}>
      <div className="container">
        <div className="section-title-row">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {viewMoreHref ? (
            <Link className="text-link" href={viewMoreHref}>
              Voir plus →
            </Link>
          ) : null}
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
