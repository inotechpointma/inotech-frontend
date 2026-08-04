import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProductSlugs, getProductBySlug, getProductVariations, getRelatedProducts } from "@/lib/woocommerce/products";
import { getProductReviews } from "@/lib/woocommerce/reviews";
import { getCategoryPathById } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";
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
import { ProductDescription } from "@/components/product/ProductDescription";

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

// Real, existing copy — the same reassurance lines as components/home/TrustSection, reused here
// (not imported directly: that component wraps its grid in .container, which would double-nest
// inside the shop layout's own .container).


/** Pure formatting from a real ISO date — no invented review metadata. */
function relativeTimeFr(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "aujourd'hui";
  if (days < 7) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? "s" : ""}`;
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
  const chipSpecs = visibleAttributes.slice(0, 2);
  const highlightSpecs = visibleAttributes.slice(0, 4);
  const brand = product.brands?.[0];
  const hasDocuments = (product.downloads?.length ?? 0) > 0;
  const ratingValue = Number(product.average_rating);
  const hasRating = product.rating_count > 0 && Number.isFinite(ratingValue) && ratingValue > 0;
  const filledStars = hasRating ? Math.round(ratingValue) : 0;

  // Short answer-style summary — every clause maps to a real field; nothing invented
  // (no condition/warranty claim, since WCProduct carries none).
  const aeoSummary = [
    `Le ${product.name}`,
    primaryCategory ? ` est un produit de la catégorie ${primaryCategory.name}` : "",
    brand ? `, proposé par ${brand.name}` : "",
    `, disponible sur iNoTech au prix de ${product.price ? `${Number(product.price).toLocaleString("fr-FR")} MAD` : "prix sur demande"}.`,
  ].join("");

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {brand ? <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand">{brand.name}</p> : null}
            <ProductInfo product={product} variations={variations} />
          </div>

          {chipSpecs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chipSpecs.map((attr) => (
                <span key={attr.id} className="rounded-full bg-surface-alt px-3 py-1.5 text-xs font-medium">
                  {attr.name} : {attr.options.join(", ")}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {highlightSpecs.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold">Caractéristiques</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {highlightSpecs.map((attr) => (
              <div key={attr.id} className="border-t border-border/30 pt-4">
                <span className="mb-1.5 block text-xs text-ink-muted">{attr.name}</span>
                <strong className="text-base font-semibold leading-snug">{attr.options.join(", ")}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {visibleAttributes.length > 0 ? (
        <section className="mt-10 rounded-lg bg-surface-alt p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <h2 className="text-2xl font-semibold">Caractéristiques techniques</h2>
            <ProductSpecs attributes={product.attributes} />
          </div>
        </section>
      ) : null}

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-muted">{aeoSummary}</p> 

      <ProductDescription html={product.description} />

      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Avis clients</h2>
          {hasRating ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-brand" aria-hidden="true">
                {"★".repeat(filledStars)}
                {"☆".repeat(5 - filledStars)}
              </span>
              <strong>{ratingValue.toFixed(1)} / 5</strong>
              <span className="text-ink-muted">({product.rating_count} avis)</span>
            </div>
          ) : null}
        </div>

        {reviews.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex min-w-[300px] max-w-[340px] flex-none flex-col gap-4 rounded-lg border border-border/15 p-6"
                style={{ scrollSnapAlign: "start" }}
              >
                <span className="text-brand" aria-hidden="true">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                <p
                  className="text-sm leading-relaxed text-ink-muted"
                  dangerouslySetInnerHTML={{ __html: review.review.replace(/<[^>]*>/g, "") }}
                />
                <div className="mt-auto flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                    {review.reviewer.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{review.reviewer}</p>
                    <p className="text-xs text-ink-muted">{relativeTimeFr(review.date_created)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <ProductReviews reviews={reviews} />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Questions fréquentes</h2>
        <ProductFAQ metaData={product.meta_data} />
      </section>
      
      <RelatedProducts products={related} />


      

      {hasDocuments ? (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Documents</h2>
          <ProductDocuments downloads={product.downloads} />
        </section>
      ) : null}
    </div>
  );
}
