export const siteConfig = {
  name: "iNoTech",
  shortName: "iNoTech",
  description: "PC portables, composants et accessoires informatiques au meilleur prix au Maroc.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pcportable.ma",
  locale: "fr-FR",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "MAD",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  contactEmail: "contact@inotech.ma",
} as const;
