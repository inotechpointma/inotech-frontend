export const siteConfig = {
  name: "PCPORTABLE",
  shortName: "PCPORTABLE.MA",
  description:
    "PC portables, MacBook, périphériques, pièces et accessoires informatiques au meilleur prix, livrés partout au Maroc.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pcportable.ma",
  locale: "fr-FR",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "MAD",
  // WhatsApp inquiry number (distinct from the header's click-to-call number below).
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212663665083",
  phone: "+212 6 22 85 00 36",
  contactEmail: "contact@pcportable.ma",
  address: "216, Rue 102, Lot Loubna Sidi Maarouf, 20280 Casablanca, Maroc",
} as const;
