"use client";

import { useState } from "react";
import { useFilters } from "@/hooks/use-filters";

export function PriceRangeFilter({ min, max }: { min: number; max: number }) {
  const { searchParams, setParam } = useFilters();
  const [localMin, setLocalMin] = useState(searchParams.get("price_min") ?? String(min));
  const [localMax, setLocalMax] = useState(searchParams.get("price_max") ?? String(max));

  function apply() {
    setParam("price_min", localMin || null);
    setParam("price_max", localMax || null);
  }

  if (min >= max) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Prix (MAD)</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          onBlur={apply}
          aria-label="Prix minimum"
          className="w-full min-w-0 rounded border border-border/30 px-2 py-1.5 text-sm"
        />
        <span className="text-ink-muted">–</span>
        <input
          type="number"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          onBlur={apply}
          aria-label="Prix maximum"
          className="w-full min-w-0 rounded border border-border/30 px-2 py-1.5 text-sm"
        />
      </div>
    </div>
  );
}
