import { wooConfig, DEFAULT_REVALIDATE_SECONDS } from "./config";

export type WooTag =
  | "products"
  | "categories"
  | "brands"
  | "tags"
  | "attributes"
  | "collections"
  | "posts"
  | `product:${number}`
  | `category:${number}`
  | `brand:${number}`
  | `tag:${string}`;

interface WooFetchOptions {
  /** Cache tags for on-demand revalidation via app/api/revalidate. */
  tags?: WooTag[];
  /** ISR window in seconds. Defaults to DEFAULT_REVALIDATE_SECONDS. */
  revalidate?: number;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${wooConfig.apiUrl}/${wooConfig.version}${path}`);
  url.searchParams.set("consumer_key", wooConfig.consumerKey);
  url.searchParams.set("consumer_secret", wooConfig.consumerSecret);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

export class WooApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public path: string,
  ) {
    super(message);
    this.name = "WooApiError";
  }
}

/**
 * Thin fetch wrapper around the WooCommerce REST API (wc/v3).
 * Returns both the parsed body and response headers (WooCommerce sends
 * X-WP-Total / X-WP-TotalPages on list endpoints, needed for pagination).
 */
export async function wooFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: WooFetchOptions = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    signal: options.signal,
    next: {
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      tags: options.tags,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new WooApiError(`WooCommerce API error (${res.status}) on ${path}: ${body}`, res.status, path);
  }

  const data = (await res.json()) as T;
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);

  return { data, total, totalPages };
}

/**
 * Fetches from the plain WordPress REST API (wp/v2/*), used for editorial content (blog posts,
 * curated "collection" custom post type) that lives outside the WooCommerce wc/v3 namespace.
 */
export async function wpFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: WooFetchOptions = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const url = new URL(`${wooConfig.apiUrl}/wp/v2${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    signal: options.signal,
    next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS, tags: options.tags },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new WooApiError(`WordPress API error (${res.status}) on ${path}: ${body}`, res.status, path);
  }

  const data = (await res.json()) as T;
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);

  return { data, total, totalPages };
}
