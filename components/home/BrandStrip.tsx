import Image from "next/image";
import Link from "next/link";
import { brandHref } from "@/lib/utils/slug";
import type { WCBrand } from "@/lib/woocommerce/types";

export function BrandStrip({ brands }: { brands: WCBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="container py-12">
      <h2 className="mb-6 text-xl font-bold">Acheter par marque</h2>
      <div className="flex flex-wrap items-center gap-8">
        {brands.map((brand) => (
          <Link key={brand.id} href={brandHref(brand.slug)} className="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
            {brand.image ? (
              <Image src={brand.image.src} alt={brand.name} width={100} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-sm font-semibold">{brand.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
