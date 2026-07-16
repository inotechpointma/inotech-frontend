import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProductSlugs, getProductBySlug, getProductVariations, getRelatedProducts } from "@/lib/woocommerce/products";
import { getProductReviews } from "@/lib/woocommerce/reviews";
import { getCategoryPathById } from "@/lib/woocommerce/categories";
import { productMetadata } from "@/lib/seo/metadata";
import { productJsonLd } from "@/lib/seo/json-ld";
import { categoryHref } from "@/lib/utils/slug";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { ProductDocuments } from "@/components/product/ProductDocuments";
import { RelatedProducts } from "@/components/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return productMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryCategory = product.categories[0];

  const [variations, reviews, related, categoryNode] = await Promise.all([
    product.type === "variable" ? getProductVariations(product.id) : Promise.resolve([]),
    getProductReviews(product.id),
    getRelatedProducts(product),
    primaryCategory ? getCategoryPathById(primaryCategory.id) : Promise.resolve(null),
  ]);

  const breadcrumbItems = [
    ...(categoryNode ? [{ name: categoryNode.name, href: categoryHref(categoryNode.path) }] : []),
    { name: product.name, href: `/product/${product.slug}` },
  ];

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />,
    },
    { id: "specs", label: "Spécifications", content: <ProductSpecs attributes={product.attributes} /> },
    { id: "reviews", label: `Avis (${product.rating_count})`, content: <ProductReviews reviews={reviews} /> },
    { id: "faq", label: "FAQ", content: <ProductFAQ metaData={product.meta_data} /> },
    { id: "documents", label: "Documents", content: <ProductDocuments downloads={product.downloads} /> },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} variations={variations} />
      </div>

      <div className="mt-10">
        <ProductTabs tabs={tabs} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
