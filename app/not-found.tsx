import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-ink-muted">Cette page n&apos;existe pas ou plus.</p>
      <Button href="/shop">Voir tous les produits</Button>
    </div>
  );
}
