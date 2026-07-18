import Image from "next/image";
import Link from "next/link";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { ProductQuickView } from "@/components/shop/ProductQuickView";
import { formatPrice } from "@/lib/utils/format-price";
import { productHref } from "@/lib/utils/slug";
import type { WCProduct } from "@/lib/woocommerce/types";

const LOW_STOCK_THRESHOLD = 5;

/**
 * Canonical product card — structure/classes ported from inotech-home.html (.product-card,
 * .product-media, .product-label, .product-actions, .icon-button, .product-body, .quick-add).
 * All content comes from the WCProduct passed in; the only presentational decision made here is
 * which single label wins when several conditions are true (out of stock > sale > featured > low
 * stock) and the low-stock threshold itself.
 */
export function ProductCard({ product }: { product: WCProduct }) {
  const image = product.images[0];
  const available = product.stock_status === "instock";
  const lowStock = available && product.stock_quantity !== null && product.stock_quantity <= LOW_STOCK_THRESHOLD;

  let label: { tone: "sale" | "featured" | "warning" | "danger"; text: string } | null = null;
  if (!available) {
    label = { tone: "danger", text: "Rupture" };
  } else if (product.on_sale) {
    label = { tone: "sale", text: "Promo" };
  } else if (product.featured) {
    label = { tone: "featured", text: "Nouveau" };
  } else if (lowStock) {
    label = { tone: "warning", text: "Stock limité" };
  }

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={productHref(product.slug)} aria-label={product.name}>
          {image ? <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 768px) 50vw, 20vw" /> : null}
        </Link>

        {label ? <span className={`product-label ${label.tone}`}>{label.text}</span> : null}

        <div className="product-actions" aria-label="Actions produit">
          <WishlistButton item={{ id: product.id, slug: product.slug, name: product.name, price: product.price, image: image?.src ?? null }} />
          <ProductQuickView product={product} />
        </div>
      </div>

      <div className="product-body">
        {product.categories[0] ? <p className="product-category">{product.categories[0].name}</p> : null}
        <Link href={productHref(product.slug)}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-price">
          {product.on_sale && product.regular_price !== product.price ? (
            <span className="old-price">{formatPrice(product.regular_price)}</span>
          ) : null}
          <span>{formatPrice(product.price)}</span>
        </div>
      </div>

      {available ? (
        <WhatsAppButton product={product} label="Commander sur WhatsApp" showLabel className="quick-add" />
      ) : (
        <div className="quick-add unavailable">
          <span>Indisponible</span>
        </div>
      )}
    </article>
  );
}
