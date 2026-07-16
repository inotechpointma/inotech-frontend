import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCategoryPaths } from "@/lib/woocommerce/categories";
import { getAllProductSlugs } from "@/lib/woocommerce/products";
import { getBrands } from "@/lib/woocommerce/brands";
import { getTags } from "@/lib/woocommerce/tags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoryPaths, productSlugs, brands, tags] = await Promise.all([
    getAllCategoryPaths().catch(() => []),
    getAllProductSlugs().catch(() => []),
    getBrands().catch(() => []),
    getTags().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categoryPaths.map((path) => ({
    url: `${siteConfig.url}/category/${path.join("/")}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${siteConfig.url}/product/${slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${siteConfig.url}/brand/${brand.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteConfig.url}/tag/${tag.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...brandEntries, ...tagEntries];
}
