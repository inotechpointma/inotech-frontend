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

/** Mirrors pcportable.ma's real (visible) footer columns — "Qui sommes-nous ?" / "Acheter". */
export const footerNav = {
  about: [
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ] satisfies NavItem[],
  shop: [
    { label: "Pc Portable", href: "/category/pc-portable" },
    { label: "Périphérique", href: "/category/peripherique" },
    { label: "Pièces", href: "/category/pieces" },
    { label: "Accessoires", href: "/category/accessoires" },
  ] satisfies NavItem[],
};
