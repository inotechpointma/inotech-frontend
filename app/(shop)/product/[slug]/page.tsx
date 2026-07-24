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

// Real, existing copy — the same reassurance lines as components/home/TrustSection, reused here
// (not imported directly: that component wraps its grid in .container, which would double-nest
// inside the shop layout's own .container).
const TRUST_ITEMS = [
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
];

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
  const highlightSpecs = visibleAttributes.slice(0, 4);
  const brand = product.brands?.[0];
  const hasDescription = product.description.trim().length > 0;
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
          <ProductInfo product={product} variations={variations} />

          {highlightSpecs.length > 0 || brand || product.sku ? (
            <div className="flex flex-wrap gap-2">
              {brand ? (
                <span className="rounded-full bg-surface-alt px-3 py-1.5 text-xs font-medium">Marque : {brand.name}</span>
              ) : null}
              {product.sku ? (
                <span className="rounded-full bg-surface-alt px-3 py-1.5 text-xs font-medium">Réf. {product.sku}</span>
              ) : null}
              {highlightSpecs.map((attr) => (
                <span key={attr.id} className="rounded-full bg-surface-alt px-3 py-1.5 text-xs font-medium">
                  {attr.name} : {attr.options.join(", ")}
                </span>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4 rounded-lg border border-border/15 p-4 sm:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20 }}>
                    {item.icon}
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
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
        <section className="mt-10 rounded-lg border border-border/15 p-6 md:p-10">
          <h2 className="mb-6 text-2xl font-semibold">Caractéristiques techniques</h2>
          <ProductSpecs attributes={product.attributes} />
        </section>
      ) : null}

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-muted">{aeoSummary}</p>

      {hasDescription ? (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Description</h2>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Avis ({product.rating_count})</h2>
          {hasRating ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-brand" aria-hidden="true">
                {"★".repeat(filledStars)}
                {"☆".repeat(5 - filledStars)}
              </span>
              <strong>{ratingValue.toFixed(1)} / 5</strong>
            </div>
          ) : null}
        </div>
        <ProductReviews reviews={reviews} />
      </section>

      <RelatedProducts products={related} />
    </div>
  );
}
