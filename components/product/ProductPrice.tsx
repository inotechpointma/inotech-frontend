import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";

export function ProductPrice({
  price,
  regularPrice,
  onSale,
  size = "md",
}: {
  price: string;
  regularPrice: string;
  onSale: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  } as const;

  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("font-bold text-ink", sizeClasses[size])}>{formatPrice(price)}</span>
      {onSale && regularPrice !== price ? (
        <span className="text-sm text-ink-muted line-through">{formatPrice(regularPrice)}</span>
      ) : null}
    </div>
  );
}
