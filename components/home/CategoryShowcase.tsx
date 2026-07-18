import Image from "next/image";
import Link from "next/link";
import { categoryHref } from "@/lib/utils/slug";
import type { CategoryNode } from "@/lib/woocommerce/types";

export function CategoryShowcase({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-title-row">
          <div>
            <h2>Que cherchez-vous ?</h2>
            <p>Accédez rapidement aux principales familles de produits.</p>
          </div>
          <Link className="text-link" href="/shop">
            Voir tout le catalogue →
          </Link>
        </div>

        <div className="category-strip">
          {categories.map((category) => (
            <Link key={category.id} className="category-tile" href={categoryHref(category.path)} aria-label={`Voir ${category.name}`}>
              <span className="category-image">
                {category.image ? <Image src={category.image.src} alt="" loading="lazy" fill sizes="120px" /> : null}
              </span>
              <strong>{category.name}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
