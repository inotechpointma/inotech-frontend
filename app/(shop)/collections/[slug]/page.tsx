import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCollectionSlugs, getCollectionBySlug, getCollectionProducts } from "@/lib/woocommerce/collections";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/shop/ProductGrid";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return { title: collection.title.rendered };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getCollectionProducts(collection);

  return (
    <div>
      <Breadcrumbs items={[{ name: collection.title.rendered, href: `/collections/${collection.slug}` }]} />
      <h1 className="mb-2 text-2xl font-bold">{collection.title.rendered}</h1>
      {collection.excerpt?.rendered ? (
        <div
          className="mb-6 max-w-2xl text-sm text-ink-muted"
          dangerouslySetInnerHTML={{ __html: collection.excerpt.rendered }}
        />
      ) : null}
      <ProductGrid products={products} />
    </div>
  );
}
