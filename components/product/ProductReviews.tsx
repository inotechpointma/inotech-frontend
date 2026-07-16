import type { WCReview } from "@/lib/woocommerce/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function ProductReviews({ reviews }: { reviews: WCReview[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-muted">Aucun avis pour ce produit pour le moment.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-border/15 pb-4 last:border-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{review.reviewer}</span>
            {review.verified ? <span className="text-xs text-success">Achat vérifié</span> : null}
          </div>
          <div aria-label={`Note ${review.rating} sur 5`} className="text-sm text-brand">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
          <p className="mt-1 text-sm text-ink-muted">{stripHtml(review.review)}</p>
        </li>
      ))}
    </ul>
  );
}
