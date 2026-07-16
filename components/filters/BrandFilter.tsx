"use client";

import { useFilters } from "@/hooks/use-filters";
import type { ResolvedFacets } from "@/lib/woocommerce/types";

export function BrandFilter({ brands }: { brands: ResolvedFacets["brands"] }) {
  const { searchParams, toggleListParam } = useFilters();
  const active = new Set(searchParams.get("brand")?.split(",").filter(Boolean));

  if (brands.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Marque</h3>
      <ul className="space-y-1.5">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.has(brand.slug)}
                onChange={() => toggleListParam("brand", brand.slug)}
                className="h-4 w-4 rounded border-border/40 accent-brand"
              />
              <span className="flex-1">{brand.name}</span>
              <span className="text-ink-muted">({brand.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
