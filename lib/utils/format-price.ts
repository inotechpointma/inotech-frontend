import { siteConfig } from "@/config/site";

export function formatPrice(value: string | number): string {
  const amount = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(amount)) return "";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
