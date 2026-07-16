"use client";

import { Button } from "@/components/ui/Button";

export default function CategoryError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="text-xl font-semibold">Impossible de charger cette catégorie</h2>
      <p className="text-sm text-ink-muted">Veuillez réessayer dans quelques instants.</p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
