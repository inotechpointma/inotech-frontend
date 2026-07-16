export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  slug?: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options: string[];
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WCImage | null;
  menu_order: number;
  count: number;
}

/** Category enriched with its resolved slug path, e.g. ["computers","laptops","gaming"] */
export interface CategoryNode extends WCCategory {
  path: string[];
  children: CategoryNode[];
}

export interface WCBrand {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: WCImage | null;
  count: number;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WCReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_avatar_urls: Record<string, string>;
  verified: boolean;
}

export type StockStatus = "instock" | "outofstock" | "onbackorder";

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: StockStatus;
  stock_quantity: number | null;
  short_description: string;
  description: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  brands?: Array<{ id: number; name: string; slug: string }>;
  images: WCImage[];
  attributes: WCAttribute[];
  variations: number[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  meta_data: Array<{ id: number; key: string; value: unknown }>;
  downloads?: Array<{ id: string; name: string; file: string }>;
}

export interface WCVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: StockStatus;
  image: WCImage | null;
  attributes: Array<{ id: number; name: string; option: string }>;
}

/** Facets resolved for a given category/brand/tag scope, derived from the products within it. */
export interface ResolvedFacets {
  priceRange: { min: number; max: number };
  brands: Array<{ slug: string; name: string; count: number }>;
  attributes: Array<{
    key: string;
    label: string;
    terms: Array<{ value: string; count: number }>;
  }>;
}

export interface ProductQueryFilters {
  page?: number;
  perPage?: number;
  orderby?: "date" | "price" | "price-desc" | "popularity" | "rating" | "title";
  category?: number;
  brand?: string;
  tag?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  attributes?: Record<string, string[]>;
  featured?: boolean;
  onSale?: boolean;
}

export interface ProductQueryResult {
  products: WCProduct[];
  total: number;
  totalPages: number;
}
