import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/woocommerce/products";

/** Lightweight typeahead endpoint for SearchBar — returns a handful of match summaries. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const { products } = await getProducts({ search: query, perPage: 6 });

  const results = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images[0]?.src ?? null,
  }));

  return NextResponse.json({ results });
}
