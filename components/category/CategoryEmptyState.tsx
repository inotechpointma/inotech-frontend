import { Button } from "@/components/ui/Button";

export function CategoryEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded border border-dashed border-border/30 py-16 text-center">
      <p className="text-ink-muted">Aucun produit disponible dans cette catégorie pour le moment.</p>
      <Button href="/shop" variant="outline" size="sm">
        Voir tous les produits
      </Button>
    </div>
  );
}
