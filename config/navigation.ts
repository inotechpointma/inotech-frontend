export interface NavItem {
  label: string;
  href: string;
}

/** Static fallback nav, rendered until/unless the Woo category tree resolves in MegaMenu. */
export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/shop" },
  { label: "Marques", href: "/brand" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  shop: [
    { label: "Tous les produits", href: "/shop" },
    { label: "Promotions", href: "/shop?on_sale=1" },
    { label: "Blog", href: "/blog" },
  ] satisfies NavItem[],
  company: [
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
};
