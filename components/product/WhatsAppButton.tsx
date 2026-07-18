"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp/build-message";
import { logInquiry } from "@/lib/inquiries/storage";
import type { WCProduct, WCVariation } from "@/lib/woocommerce/types";

interface WhatsAppButtonProps {
  product: Pick<WCProduct, "name" | "sku" | "permalink" | "price">;
  variation?: Pick<WCVariation, "sku" | "price" | "attributes"> | null;
  quantity?: number;
  className?: string;
  /** Visible label — restyle/rename freely, the link + click behavior below never changes. */
  label?: string;
  /** Set false to render an icon-only button (label still used for aria-label). */
  showLabel?: boolean;
}

export function WhatsAppButton({
  product,
  variation,
  quantity = 1,
  className,
  label = "Commander sur WhatsApp",
  showLabel = true,
}: WhatsAppButtonProps) {
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
      aria-label={label}
      className={
        className ??
        "inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-whatsapp px-6 font-semibold text-white hover:opacity-90"
      }
    >
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <path d="M3 20.5 4.5 16A8 8 0 1 1 8 19.5Z" />
        <path d="M8.5 9.5c.3 2 2 3.7 4 4l1-1.3c.2-.3.6-.4.9-.2l2 1c.3.2.4.6.3.9-.4 1-1.4 1.6-2.4 1.4-3-.6-5.4-3-6-6-.2-1 .4-2 1.4-2.4.3-.1.7 0 .9.3l1 2c.2.3.1.7-.2.9Z" />
      </svg>
    </a>
  );
}
