# iNoTech — Headless WooCommerce Frontend

Next.js (App Router) storefront for a WooCommerce catalog hosted on Hostinger. No cart or
payment gateway — every product page ends in a prefilled WhatsApp inquiry instead of checkout.

## Stack

Next.js 15 (App Router, RSC) · TypeScript · WooCommerce REST API (wc/v3) · WordPress REST API
(wp/v2, for blog + curated collections) · Tailwind CSS · ISR + on-demand revalidation.

## Core routing principle

Categories are a catch-all route (`app/(shop)/category/[...slug]`), so any depth created in
WooCommerce (`Computers → Laptops → Gaming`) renders automatically — no code change needed for a
new category or subcategory. Products, brands, and tags each get their own flat dynamic segment.
Filters (`FiltersSidebar`) are URL-driven facets resolved per scope by
`lib/woocommerce/facets.ts::resolveFacets()`, combining what's actually in the data with the
config in `lib/filters/facet-config.ts` (so a motherboard listing doesn't show "Battery
Capacity").

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in WooCommerce REST keys, WhatsApp number, revalidate secret
npm run dev
```

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Environment variables

See `.env.example`. `WC_CONSUMER_KEY`/`WC_CONSUMER_SECRET` are generated in WooCommerce →
Settings → Advanced → REST API (read-only permissions are enough for this frontend).
`REVALIDATE_SECRET` is shared with the WooCommerce webhook that hits `/api/revalidate` on
product/category changes (Settings → Advanced → Webhooks).

## Notes

- **Brands**: uses WooCommerce's native `product_brand` taxonomy (`/wc/v3/products/brands`). If
  the store uses a different brands plugin/namespace instead, only `lib/woocommerce/brands.ts`
  needs to change.
- **Collections** (`/collections/[slug]`) are curated via a `collection` custom post type in
  WordPress (`wp/v2/collection`) carrying a `product_ids` meta field — editorial curation, unlike
  the fully data-driven category/brand/tag routes.
- **i18n**: not wired up. If FR/AR routing is needed later, add locale prefixing in
  `middleware.ts`; the route tree underneath doesn't need to change.
- **No cart**: `app/(account)` is a minimal localStorage-backed wishlist + inquiry history, kept
  deliberately thin since there's no checkout to anchor a real account system to.
