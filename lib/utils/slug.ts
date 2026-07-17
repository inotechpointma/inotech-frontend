/** Turns a catch-all route param (string[]) into the "/"-joined slug path used by the Woo lookup. */
export function segmentsToPath(segments: string[]): string[] {
  return segments.filter(Boolean);
}

/** Builds the canonical /category/... href for a resolved slug path. */
export function categoryHref(path: string[]): string {
  return `/category/${path.join("/")}`;
}

export function productHref(slug: string): string {
  return `/product/${slug}`;
}

export function brandHref(slug: string): string {
  return `/brand/${slug}`;
}

export function tagHref(slug: string): string {
  return `/tag/${slug}`;
}

/** Derives the "pa_xxx" attribute taxonomy slug WooCommerce would use for a given attribute name. */
export function attributeSlugFromName(name: string): string {
  return `pa_${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}
