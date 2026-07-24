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

  // Real, existing attributes only — no invented "key features"/"condition" data.
  const visibleAttributes = product.attributes.filter((attr) => attr.visible !== false && attr.options.length > 0);
  const quickSpecs = visibleAttributes.slice(0, 6);
  const brand = product.brands?.[0];
  const hasDescription = product.description.trim().length > 0;
  const hasDocuments = (product.downloads?.length ?? 0) > 0;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <ProductInfo product={product} variations={variations} />

          {quickSpecs.length > 0 || brand || product.sku ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border/15 bg-surface-alt p-4 sm:grid-cols-3">
              {brand ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">Marque</dt>
                  <dd className="text-sm font-medium">{brand.name}</dd>
                </div>
              ) : null}
              {product.sku ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">Référence</dt>
                  <dd className="text-sm font-medium">{product.sku}</dd>
                </div>
              ) : null}
              {quickSpecs.map((attr) => (
                <div key={attr.id}>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">{attr.name}</dt>
                  <dd className="text-sm font-medium">{attr.options.join(", ")}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <section className="section">
        <div className="trust-grid">
          {[
            {
              title: "Livraison nationale",
              description: "Expédition et suivi de commande partout au Maroc.",
              icon: (
                <>
                  <path d="M3 6h13v11H3zM16 10h3l2 3v4h-5z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </>
              ),
            },
            {
              title: "Produits garantis",
              description: "Des références sélectionnées avec une garantie clairement indiquée.",
              icon: (
                <>
                  <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </>
              ),
            },
            {
              title: "Conseil technique",
              description: "Une aide simple pour choisir une configuration cohérente.",
              icon: (
                <>
                  <path d="M4 4h16v16H4z" />
                  <path d="M8 12h8M12 8v8" />
                </>
              ),
            },
            {
              title: "SAV & accompagnement",
              description: "Une équipe disponible pour vous orienter après l'achat.",
              icon: (
                <>
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </>
              ),
            },
          ].map((item) => (
            <article key={item.title} className="trust-card">
              <span className="trust-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {item.icon}
                </svg>
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {hasDescription ? (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Description</h2>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </section>
      ) : null}

      {visibleAttributes.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Caractéristiques techniques</h2>
          <ProductSpecs attributes={product.attributes} />
        </section>
      ) : null}

      {hasDocuments ? (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Documents</h2>
          <ProductDocuments downloads={product.downloads} />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Questions fréquentes</h2>
        <ProductFAQ metaData={product.meta_data} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Avis ({product.rating_count})</h2>
        <ProductReviews reviews={reviews} />
      </section>

      <RelatedProducts products={related} />
    </div>
  );
}
