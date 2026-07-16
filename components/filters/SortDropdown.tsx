"use client";

import { useFilters } from "@/hooks/use-filters";

const OPTIONS = [
  { value: "date", label: "Nouveautés" },
  { value: "popularity", label: "Popularité" },
  { value: "rating", label: "Meilleures notes" },
  { value: "price", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export function SortDropdown() {
  const { searchParams, setParam } = useFilters();
  const current = searchParams.get("orderby") ?? "date";

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-ink-muted">Trier par</span>
      <select
        value={current}
        onChange={(e) => setParam("orderby", e.target.value)}
        className="rounded border border-border/30 bg-surface px-2 py-1.5"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
