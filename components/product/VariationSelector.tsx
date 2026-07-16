"use client";

import { cn } from "@/lib/utils/cn";
import type { WCAttribute } from "@/lib/woocommerce/types";

interface VariationSelectorProps {
  attributes: WCAttribute[];
  selected: Record<string, string>;
  onSelect: (attributeName: string, option: string) => void;
}

/** Renders one control per variation attribute (color, config...); options come entirely from Woo. */
export function VariationSelector({ attributes, selected, onSelect }: VariationSelectorProps) {
  const variationAttributes = attributes.filter((attr) => attr.variation);
  if (variationAttributes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {variationAttributes.map((attr) => (
        <div key={attr.id ?? attr.name}>
          <h3 className="mb-2 text-sm font-semibold">{attr.name}</h3>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(attr.name, option)}
                className={cn(
                  "rounded border px-3 py-1.5 text-sm",
                  selected[attr.name] === option
                    ? "border-brand bg-brand text-white"
                    : "border-border/30 hover:border-brand",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
