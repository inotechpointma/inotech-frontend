import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils/format-price";
import type { WCProduct, WCVariation } from "@/lib/woocommerce/types";

export interface WhatsAppInquiryInput {
  product: Pick<WCProduct, "name" | "sku" | "permalink" | "price">;
  variation?: Pick<WCVariation, "sku" | "price" | "attributes"> | null;
  quantity?: number;
}

/** Composes a prefilled, human-readable inquiry message for a product (and optional variation). */
export function buildWhatsAppMessage({ product, variation, quantity = 1 }: WhatsAppInquiryInput): string {
  const lines = [`Bonjour, je suis intéressé(e) par ce produit :`, ``, `*${product.name}*`];

  const sku = variation?.sku || product.sku;
  if (sku) lines.push(`Référence : ${sku}`);

  if (variation?.attributes?.length) {
    const options = variation.attributes.map((a) => `${a.name}: ${a.option}`).join(", ");
    lines.push(`Configuration : ${options}`);
  }

  if (quantity > 1) lines.push(`Quantité : ${quantity}`);

  const price = variation?.price || product.price;
  if (price) lines.push(`Prix : ${formatPrice(price)}`);

  lines.push(``, `Lien : ${product.permalink}`);

  return lines.join("\n");
}

/** Builds the final https://wa.me/<phone>?text=<encoded> deep link. */
export function buildWhatsAppLink(input: WhatsAppInquiryInput): string {
  const message = buildWhatsAppMessage(input);
  const phone = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
