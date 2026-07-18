export interface NavItem {
  label: string;
  href: string;
}

/** Footer columns — mirrors inotech-home.html's Catalogue / Services / Nous contacter layout. */
export const footerNav = {
  catalogue: [
    { label: "Ordinateurs portables", href: "/category/pc-portable" },
    { label: "PC Gamer", href: "/shop" },
    { label: "Périphériques", href: "/category/peripherique" },
    { label: "Composants & stockage", href: "/category/pieces" },
  ] satisfies NavItem[],
  services: [
    { label: "Conseil avant achat", href: "/contact" },
    { label: "Devis entreprise", href: "/contact" },
    { label: "Livraison", href: "/about" },
    { label: "Garantie & SAV", href: "/about" },
  ] satisfies NavItem[],
};
