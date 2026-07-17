/**
 * Config-driven half of facet resolution (see lib/woocommerce/facets.ts for the data-driven half).
 * Maps a category slug to the global attribute taxonomies worth exposing as filters, so a
 * webcam category doesn't surface "Socket" just because some product in it has that attribute
 * set. Falls back to whatever attributes are present when a category isn't listed here — new
 * categories still get working filters with zero config.
 *
 * Keys are the actual pcportable.ma category slugs (see the analysis in README.md); values are
 * WooCommerce global attribute taxonomy slugs (the "pa_" names).
 */
export const CATEGORY_ATTRIBUTE_MAP: Record<string, string[]> = {
  // Pc Portable > Gamer / Multimedia
  "pc-portable": ["pa_processeur", "pa_ram", "pa_stockage", "pa_carte-graphique", "pa_taille-ecran"],
  "pc-portable-gamer": ["pa_processeur", "pa_carte-graphique", "pa_ram", "pa_stockage", "pa_taux-de-rafraichissement"],
  "pc-portable-multimedia": ["pa_processeur", "pa_ram", "pa_stockage", "pa_taille-ecran"],

  // Macbook > Pro / Air
  macbook: ["pa_puce", "pa_ram", "pa_stockage", "pa_taille-ecran"],
  "macbook-pro": ["pa_puce", "pa_ram", "pa_stockage"],
  "macbook-air": ["pa_puce", "pa_ram", "pa_stockage"],

  "casque-vr": ["pa_compatibilite", "pa_resolution"],

  // Pièces De Rechanges
  pieces: ["pa_compatibilite"],
  "chargeur-pc-portable": ["pa_puissance", "pa_connecteur", "pa_compatibilite"],
  "batterie-pc-portable": ["pa_capacite", "pa_compatibilite"],
  "memoire-ram": ["pa_capacite", "pa_type-memoire", "pa_frequence"],
  "disque-dur-hdd": ["pa_capacite", "pa_interface"],
  ssd: ["pa_capacite", "pa_interface"],
  "disque-dur-externe": ["pa_capacite", "pa_interface"],

  // Périphériques
  peripherique: ["pa_connectivite"],
  souris: ["pa_connectivite", "pa_couleur"],
  clavier: ["pa_connectivite", "pa_couleur"],
  "combo-clavier-souris": ["pa_connectivite"],
  moniteur: ["pa_taille-ecran", "pa_resolution", "pa_taux-de-rafraichissement"],
  casque: ["pa_connectivite"],
  microphone: ["pa_connectivite"],
  webcam: ["pa_resolution"],
  "enceinte-pc": ["pa_puissance", "pa_connectivite"],
  manette: ["pa_connectivite", "pa_compatibilite"],
  "volant-pc": ["pa_compatibilite"],

  // Accessoires
  accessoires: ["pa_couleur"],
  "support-pc-portable": ["pa_taille-ecran", "pa_materiau"],
  "tapis-de-souris": ["pa_taille", "pa_materiau"],
  housses: ["pa_taille-ecran", "pa_couleur"],
  "cartable-pc": ["pa_taille-ecran", "pa_couleur"],

  // Chaises & Bureaux
  "chaises-bureaux": ["pa_couleur", "pa_materiau"],
  chaises: ["pa_couleur", "pa_materiau"],
  bureaux: ["pa_dimensions", "pa_couleur"],
};

export function getConfiguredAttributesForCategory(categorySlug: string): string[] | null {
  return CATEGORY_ATTRIBUTE_MAP[categorySlug] ?? null;
}
