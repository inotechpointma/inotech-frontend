import { wooFetch } from "./client";
import { useFixtures } from "./config";
import type { WCReview } from "./types";

export async function getProductReviews(productId: number): Promise<WCReview[]> {
  if (useFixtures) return [];

  const { data } = await wooFetch<WCReview[]>(
    "/products/reviews",
    { product: productId, per_page: 50, status: "approved" },
    { tags: [`product:${productId}`] },
  );
  return data;
}
