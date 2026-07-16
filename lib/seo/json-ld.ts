import { siteConfig } from "@/config/site";
import type { WCProduct } from "@/lib/woocommerce/types";

export function productJsonLd(product: WCProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.images.map((img) => img.src),
    description: product.short_description.replace(/<[^>]*>/g, ""),
    brand: product.brands?.[0] ? { "@type": "Brand", name: product.brands[0].name } : undefined,
    aggregateRating:
      product.rating_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.rating_count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : product.stock_status === "onbackorder"
            ? "https://schema.org/BackOrder"
            : "https://schema.org/OutOfStock",
    },
  };
}

export interface BreadcrumbEntry {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
