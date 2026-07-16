import { SortDropdown } from "@/components/filters/SortDropdown";
import { MobileFilterDrawer } from "@/components/filters/MobileFilterDrawer";
import type { ResolvedFacets } from "@/lib/woocommerce/types";

export function ResultsHeader({ total, facets }: { total: number; facets: ResolvedFacets }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <p className="text-sm text-ink-muted">
        {total} {total > 1 ? "produits" : "produit"}
      </p>
      <div className="flex items-center gap-3">
        <MobileFilterDrawer facets={facets} />
        <SortDropdown />
      </div>
    </div>
  );
}
