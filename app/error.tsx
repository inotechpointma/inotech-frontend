"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
      <p className="text-ink-muted">Veuillez réessayer dans quelques instants.</p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
