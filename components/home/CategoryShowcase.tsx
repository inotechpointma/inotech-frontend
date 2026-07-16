import Image from "next/image";
import Link from "next/link";
import { categoryHref } from "@/lib/utils/slug";
import type { CategoryNode } from "@/lib/woocommerce/types";

export function CategoryShowcase({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container py-12">
      <h2 className="mb-6 text-xl font-bold">Nos catégories</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={categoryHref(category.path)}
            className="flex flex-col items-center gap-2 rounded border border-border/15 bg-surface p-4 text-center transition-shadow hover:shadow-card"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-surface-alt">
              {category.image ? (
                <Image src={category.image.src} alt={category.name} fill sizes="64px" className="object-contain p-2" />
              ) : null}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
