"use client";

import { useFilters } from "@/hooks/use-filters";
import type { ResolvedFacets } from "@/lib/woocommerce/types";

/** Generic facet renderer: same component renders Socket, Chipset, RAM, Refresh Rate, etc. */
export function AttributeFilter({ attribute }: { attribute: ResolvedFacets["attributes"][number] }) {
  const { searchParams, toggleListParam } = useFilters();
  const active = new Set(searchParams.get(attribute.key)?.split(",").filter(Boolean));

  if (attribute.terms.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{attribute.label}</h3>
      <ul className="space-y-1.5">
        {attribute.terms.map((term) => (
          <li key={term.value}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.has(term.value)}
                onChange={() => toggleListParam(attribute.key, term.value)}
                className="h-4 w-4 rounded border-border/40 accent-brand"
              />
              <span className="flex-1">{term.value}</span>
              <span className="text-ink-muted">({term.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
