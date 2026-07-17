# iNoTech — Headless WooCommerce Frontend for PCPORTABLE.MA

Next.js (App Router) storefront rebuilding pcportable.ma (WooCommerce + Woodmart theme +
Elementor, hosted on Hostinger) as a headless frontend. No cart or payment gateway — every
product page ends in a prefilled WhatsApp inquiry instead of checkout.

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

## Design system (extracted from pcportable.ma)

Tokens live in `app/globals.css` (CSS custom properties) and are wired into `tailwind.config.js`.
Source values, from a full analysis of the site's rendered HTML/CSS (Woodmart theme):

| Token | Value | Source |
|---|---|---|
| Brand red | `rgb(220,25,27)` | header primary-nav bar background, logo accent |
| Header row | black `rgb(0,0,0)` | header general row |
| Sale badge | `rgb(140,188,103)` (green) | `.product-label.onsale` override |
| Featured badge | `rgb(225,74,92)` | `.product-label.featured` override |
| Out-of-stock badge | `rgb(13,6,37)` | `.product-label.out-of-stock` override |
| WhatsApp | `#25d366` | chat widget brand color |
| Body font | Albert Sans (400) | `--wd-text-font` |
| Heading font | Urbanist (600/700) | `--wd-title-font` / `--wd-entities-title-font` |
| Base font size | 15px | `html { font-size }` |
| Border radius | 20px general, 35px pill (buttons/search), 12px badges, 50% category thumbnails | `--wd-brd-radius`, `--wd-form-brd-radius` |
| Shadows | dropdown `0 0 3px rgba(0,0,0,.15)`, sticky header `0 1px 3px rgba(0,0,0,.1)`, buttons/cards flat (no shadow) | theme CSS parts |
| Container | 1660px (very wide) | `--wd-container-w` |
| Currency | MAD, literal suffix (no visible language/currency switcher despite WPML being installed) | rendered price markup |

Real store details carried over into `config/site.ts`: WhatsApp inquiry number
`+212 6 63 66 50 83` (from the site's chat widget), header click-to-call number
`+212 6 22 85 00 36`, address `216, Rue 102, Lot Loubna Sidi Maarouf, 20280 Casablanca`.

**Intentionally not reproduced**: the source site has two dead sections — a secondary top bar
(About/Partners/Contact/FAQ links) hidden at every breakpoint by conflicting CSS classes, and a
"collapsible content" block of unedited Woodmart demo filler text, both permanently invisible on
the live site. Treated as bugs, not design intent, and left out of this rebuild.

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
