"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp/build-message";
import { logInquiry } from "@/lib/inquiries/storage";
import type { WCProduct, WCVariation } from "@/lib/woocommerce/types";

interface WhatsAppButtonProps {
  product: Pick<WCProduct, "name" | "sku" | "permalink" | "price">;
  variation?: Pick<WCVariation, "sku" | "price" | "attributes"> | null;
  quantity?: number;
  className?: string;
}

export function WhatsAppButton({ product, variation, quantity = 1, className }: WhatsAppButtonProps) {
  const href = buildWhatsAppLink({ product, variation, quantity });

  function handleClick() {
    const sku = variation?.sku || product.sku;
    logInquiry({ productName: product.name, sku });
    fetch("/api/whatsapp-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName: product.name, sku }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={
        className ??
        "inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-whatsapp px-6 font-semibold text-white hover:opacity-90"
      }
    >
      <span aria-hidden>💬</span>
      Commander sur WhatsApp
    </a>
  );
}
