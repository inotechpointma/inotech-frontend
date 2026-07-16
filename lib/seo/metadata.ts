import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { WCProduct } from "@/lib/woocommerce/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export function productMetadata(product: WCProduct): Metadata {
  const description = stripHtml(product.short_description || product.description).slice(0, 160);
  const image = product.images[0]?.src;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.images[0]?.alt || product.name }] : undefined,
    },
  };
}

export function categoryMetadata(name: string, description: string, path: string[]): Metadata {
  return {
    title: name,
    description: stripHtml(description).slice(0, 160) || `Découvrez notre sélection ${name} au meilleur prix.`,
    alternates: { canonical: `/category/${path.join("/")}` },
  };
}
