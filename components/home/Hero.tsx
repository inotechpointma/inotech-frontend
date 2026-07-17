import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="bg-brand text-white">
      <div className="container flex flex-col items-start gap-4 py-16 md:py-24">
        <h1 className="max-w-xl text-3xl font-bold md:text-5xl">
          PC Portable, MacBook &amp; accessoires au meilleur prix
        </h1>
        <p className="max-w-lg text-white/90">
          Livraison partout au Maroc. Commandez directement sur WhatsApp, sans compte ni paiement
          en ligne.
        </p>
        <Button href="/shop" variant="secondary" size="lg" className="mt-2 text-ink">
          Découvrez maintenant
        </Button>
      </div>
    </section>
  );
}
