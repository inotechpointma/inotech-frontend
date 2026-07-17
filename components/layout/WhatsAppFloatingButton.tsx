"use client";

import { siteConfig } from "@/config/site";

const DEFAULT_MESSAGE = "Bonjour, j'ai besoin d'informations s'il vous plaît.";

/** Persistent site-wide WhatsApp bubble (bottom-right), separate from the per-product inquiry
 * button in components/product/WhatsAppButton.tsx — this one carries a generic greeting for
 * visitors browsing pages that aren't a specific product. */
export function WhatsAppFloatingButton() {
  if (!siteConfig.whatsappNumber) return null;

  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Besoin d'aide ? Discutez avec nous sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-2xl text-white shadow-lg transition-transform hover:scale-105"
    >
      <span aria-hidden>💬</span>
    </a>
  );
}
