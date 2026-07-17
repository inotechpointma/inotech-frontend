/**
 * Template placeholders for iNoTech's future WooCommerce store. The layout/design system in this
 * project is cloned from pcportable.ma (see README "Design system" section) as a reference
 * template only — this frontend connects to iNoTech's own WooCommerce/WordPress backend
 * (WORDPRESS_API_URL etc. in .env), never to pcportable.ma. Fill in real values once iNoTech's
 * store, WhatsApp line, and contact details are available.
 */
export const siteConfig = {
  name: "iNoTech",
  shortName: "iNoTech",
  description:
    "PC portables, périphériques, pièces et accessoires informatiques au meilleur prix, livrés partout au Maroc.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://inotech.ma",
  locale: "fr-FR",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "MAD",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  contactEmail: "contact@inotech.ma",
  address: "Adresse à renseigner",
} as const;
