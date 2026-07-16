import { Badge } from "@/components/ui/Badge";
import type { StockStatus } from "@/lib/woocommerce/types";

const LABELS: Record<StockStatus, string> = {
  instock: "En stock",
  outofstock: "Rupture de stock",
  onbackorder: "Sur commande",
};

export function StockBadge({ status }: { status: StockStatus }) {
  if (status === "instock") return <Badge tone="new">{LABELS[status]}</Badge>;
  if (status === "onbackorder") return <Badge tone="neutral">{LABELS[status]}</Badge>;
  return <Badge tone="outofstock">{LABELS[status]}</Badge>;
}
