import { cn } from "@/lib/utils/cn";

type BadgeTone = "sale" | "featured" | "new" | "outofstock" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  sale: "bg-sale text-white",
  featured: "bg-featured text-white",
  new: "bg-success text-white",
  outofstock: "bg-outofstock text-white",
  neutral: "bg-surface-alt text-ink",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-badge px-2 py-0.5 text-xs font-semibold uppercase tracking-wide", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
