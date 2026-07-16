import Image from "next/image";
import Link from "next/link";
import { categoryHref } from "@/lib/utils/slug";
import type { CategoryNode } from "@/lib/woocommerce/types";

/** Lists the children of the current category (e.g. Laptops, Desktop PCs under Computers). */
export function SubcategoryGrid({ subcategories }: { subcategories: CategoryNode[] }) {
  if (subcategories.length === 0) return null;

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {subcategories.map((subcategory) => (
        <Link
          key={subcategory.id}
          href={categoryHref(subcategory.path)}
          className="flex flex-col items-center gap-2 rounded border border-border/15 bg-surface p-4 text-center transition-shadow hover:shadow-card"
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-surface-alt">
            {subcategory.image ? (
              <Image src={subcategory.image.src} alt={subcategory.name} fill sizes="56px" className="object-contain p-2" />
            ) : null}
          </div>
          <span className="text-sm font-medium">{subcategory.name}</span>
          <span className="text-xs text-ink-muted">{subcategory.count} produits</span>
        </Link>
      ))}
    </div>
  );
}
