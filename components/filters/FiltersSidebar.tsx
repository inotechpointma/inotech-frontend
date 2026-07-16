import { PriceRangeFilter } from "@/components/filters/PriceRangeFilter";
import { BrandFilter } from "@/components/filters/BrandFilter";
import { AttributeFilter } from "@/components/filters/AttributeFilter";
import type { ResolvedFacets } from "@/lib/woocommerce/types";

/**
 * Renders whatever facets it's handed for the current scope (category/brand/tag/shop) — the
 * same component surfaces Laptops/Desktop + brands under Computers and Socket/Chipset + brands
 * under Components, purely because resolveFacets() returned a different facet set.
 */
export function FiltersSidebar({ facets }: { facets: ResolvedFacets }) {
  return (
    <aside className="flex flex-col gap-6">
      <PriceRangeFilter min={facets.priceRange.min} max={facets.priceRange.max} />
      <BrandFilter brands={facets.brands} />
      {facets.attributes.map((attribute) => (
        <AttributeFilter key={attribute.key} attribute={attribute} />
      ))}
    </aside>
  );
}
