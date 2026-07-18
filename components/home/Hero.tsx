import Link from "next/link";
import Image from "next/image";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";

export interface SideCard {
  tone: "info" | "warning";
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  description: string;
  cta: { label: string; href: string; variant: "btn-primary" | "btn-secondary" };
  image: { src: string; alt: string };
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Rentrée Tech 2026",
    title: "La performance adaptée à votre quotidien.",
    description:
      "Ordinateurs portables, écrans et accessoires sélectionnés pour travailler, créer et jouer avec confiance.",
    primaryCta: { label: "Découvrir les offres", href: "/shop" },
    secondaryCta: { label: "Explorer les catégories", href: "/shop" },
    image: { src: "/hero/slide-1.svg", alt: "Ordinateur portable gaming présenté en promotion" },
  },
  {
    eyebrow: "Solutions professionnelles",
    title: "Équipez votre entreprise sans complexité.",
    description:
      "Des configurations fiables, des conseils clairs et un accompagnement adapté aux besoins des professionnels.",
    primaryCta: { label: "Voir les PC professionnels", href: "/shop" },
    secondaryCta: { label: "Demander un devis", href: "/contact" },
    image: { src: "/hero/slide-2.svg", alt: "Ordinateur professionnel" },
  },
  {
    eyebrow: "Setup Gaming",
    title: "Plus de fluidité. Plus de précision.",
    description:
      "Composez un setup cohérent avec des écrans rapides, des périphériques réactifs et des machines prêtes à jouer.",
    primaryCta: { label: "Construire mon setup", href: "/shop" },
    secondaryCta: { label: "Voir les moniteurs", href: "/shop" },
    image: { src: "/hero/slide-3.svg", alt: "Moniteur gaming" },
  },
];

const DEFAULT_SIDE_CARDS: SideCard[] = [
  {
    tone: "info",
    eyebrow: "Livraison nationale",
    eyebrowColor: "#154961",
    title: "Votre commande, partout au Maroc.",
    description: "Suivi clair et assistance avant comme après l'achat.",
    cta: { label: "Nos engagements", href: "/about", variant: "btn-primary" },
    image: { src: "/hero/side-delivery.svg", alt: "" },
  },
  {
    tone: "warning",
    eyebrow: "Conseil personnalisé",
    eyebrowColor: "#60561C",
    title: "Besoin de la bonne configuration ?",
    description: "Expliquez votre usage, nous vous orientons vers le matériel adapté.",
    cta: { label: "Parler à un conseiller", href: "/contact", variant: "btn-secondary" },
    image: { src: "/hero/side-advice.svg", alt: "" },
  },
];

export function Hero({
  slides = DEFAULT_SLIDES,
  sideCards = DEFAULT_SIDE_CARDS,
}: {
  slides?: HeroSlide[];
  sideCards?: SideCard[];
}) {
  return (
    <section className="section">
      <div className="container hero-grid">
        <HeroSlider slides={slides} />

        <aside className="hero-side" aria-label="Offres complémentaires">
          {sideCards.map((card) => (
            <article key={card.title} className={`side-card ${card.tone}`}>
              <div>
                <span className="eyebrow" style={{ background: "#fff", color: card.eyebrowColor }}>
                  {card.eyebrow}
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link className={`btn ${card.cta.variant}`} href={card.cta.href}>
                  {card.cta.label}
                </Link>
              </div>
              {card.image.src ? (
                <Image src={card.image.src} alt={card.image.alt} width={300} height={300} aria-hidden={!card.image.alt} />
              ) : null}
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
}
