/**
 * Config-driven half of facet resolution (see lib/woocommerce/facets.ts for the data-driven half).
 * Maps a category slug to the global attribute taxonomies worth exposing as filters, so a
 * motherboard category doesn't surface "Battery Capacity" just because some product in it has
 * that attribute set. Falls back to DEFAULT_ATTRIBUTES (whatever attributes are present) when a
 * category isn't listed here — new categories still get working filters with zero config.
 *
 * Keys are WooCommerce global attribute slugs (the "pa_" taxonomy names).
 */
export const CATEGORY_ATTRIBUTE_MAP: Record<string, string[]> = {
  laptops: ["pa_processeur", "pa_ram", "pa_stockage", "pa_carte-graphique", "pa_taille-ecran"],
  "desktop-pcs": ["pa_processeur", "pa_ram", "pa_stockage", "pa_carte-graphique"],
  components: ["pa_socket", "pa_chipset", "pa_form-factor"],
  processeurs: ["pa_socket", "pa_nombre-de-coeurs"],
  "cartes-meres": ["pa_socket", "pa_chipset", "pa_form-factor"],
  "cartes-graphiques": ["pa_chipset", "pa_memoire-vram"],
  ram: ["pa_capacite", "pa_type-memoire", "pa_frequence"],
  stockage: ["pa_capacite", "pa_interface"],
  moniteurs: ["pa_taux-de-rafraichissement", "pa_resolution", "pa_dalle"],
  peripheriques: ["pa_connectivite", "pa_couleur"],
};

/** Attribute slugs to try when a category has no explicit mapping above. */
export const DEFAULT_ATTRIBUTES: string[] = [];

export function getConfiguredAttributesForCategory(categorySlug: string): string[] | null {
  return CATEGORY_ATTRIBUTE_MAP[categorySlug] ?? null;
}
