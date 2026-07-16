"use client";

import { useFilters } from "@/hooks/use-filters";

const LABEL_KEYS = new Set(["brand", "price_min", "price_max"]);

export function ActiveFilters() {
  const { searchParams, setParam, toggleListParam, clearAll } = useFilters();
  const entries = [...searchParams.entries()].filter(([key]) => key !== "orderby" && key !== "page");

  if (entries.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {entries.map(([key, value]) => {
        if (key === "price_min" || key === "price_max") {
          return (
            <button
              key={key}
              onClick={() => setParam(key, null)}
              className="flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-xs"
            >
              {key === "price_min" ? "Min" : "Max"}: {value} ✕
            </button>
          );
        }

        return value
          .split(",")
          .filter(Boolean)
          .map((v) => (
            <button
              key={`${key}-${v}`}
              onClick={() => (LABEL_KEYS.has(key) || key.startsWith("pa_") ? toggleListParam(key, v) : setParam(key, null))}
              className="flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-xs"
            >
              {v} ✕
            </button>
          ));
      })}

      <button onClick={clearAll} className="text-xs font-medium text-brand underline">
        Réinitialiser
      </button>
    </div>
  );
}
