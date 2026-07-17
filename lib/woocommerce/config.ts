function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const wooConfig = {
  apiUrl: required("WORDPRESS_API_URL", process.env.WORDPRESS_API_URL),
  consumerKey: required("WC_CONSUMER_KEY", process.env.WC_CONSUMER_KEY),
  consumerSecret: required("WC_CONSUMER_SECRET", process.env.WC_CONSUMER_SECRET),
  version: "wc/v3" as const,
};

export const revalidateSecret = process.env.REVALIDATE_SECRET ?? "";

/**
 * Local/preview-only switch (see lib/woocommerce/fixtures.ts) that serves realistic sample data
 * instead of hitting a real WooCommerce backend — useful to run/preview this template before
 * iNoTech's own store exists. Never set in production; not part of .env.example.
 */
export const useFixtures = process.env.USE_FIXTURES === "true";

/** Default ISR window for category/product/listing pages; on-demand revalidation overrides this. */
export const DEFAULT_REVALIDATE_SECONDS = 3600;
