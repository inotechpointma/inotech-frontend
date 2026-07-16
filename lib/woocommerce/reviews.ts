import { wooFetch } from "./client";
import type { WCReview } from "./types";

export async function getProductReviews(productId: number): Promise<WCReview[]> {
  const { data } = await wooFetch<WCReview[]>(
    "/products/reviews",
    { product: productId, per_page: 50, status: "approved" },
    { tags: [`product:${productId}`] },
  );
  return data;
}
