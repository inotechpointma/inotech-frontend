import Image from "next/image";
import Link from "next/link";
import { brandHref } from "@/lib/utils/slug";
import type { WCBrand } from "@/lib/woocommerce/types";

export function BrandStrip({ brands }: { brands: WCBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="section" id="brands">
      <div className="container">
        <div className="section-title-row">
          <div>
            <h2>Acheter par marque</h2>
            <p>Retrouvez les références des fabricants les plus demandés.</p>
          </div>
        </div>

        <div className="brand-strip">
          {brands.map((brand) => (
            <Link key={brand.id} className="brand-chip" href={brandHref(brand.slug)} aria-label={brand.name}>
              {brand.image ? <Image src={brand.image.src} alt={brand.name} width={130} height={60} /> : brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
