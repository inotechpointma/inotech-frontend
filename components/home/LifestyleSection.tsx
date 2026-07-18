import Link from "next/link";
import Image from "next/image";

export interface LifestyleCard {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
}

const DEFAULT_CARDS: LifestyleCard[] = [
  {
    eyebrow: "Mobilité",
    title: "Travaillez partout.",
    description: "Des portables légers et fiables pour rester productif en déplacement.",
    cta: { label: "Explorer", href: "/shop" },
    image: { src: "/hero/lifestyle-mobility.svg", alt: "Ordinateur portable pour mobilité" },
  },
  {
    eyebrow: "Création",
    title: "Voyez chaque détail.",
    description: "Des écrans précis et confortables pour la création et le multitâche.",
    cta: { label: "Explorer", href: "/shop" },
    image: { src: "/hero/lifestyle-creation.svg", alt: "Écran pour création et productivité" },
  },
  {
    eyebrow: "Connexion",
    title: "Un réseau plus stable.",
    description: "Routeurs et solutions réseau pour la maison, le bureau et le gaming.",
    cta: { label: "Explorer", href: "/shop" },
    image: { src: "/hero/lifestyle-network.svg", alt: "Routeur Wi-Fi" },
  },
];

/** Purely editorial (per brief) — no Woo data involved. */
export function LifestyleSection({ id, cards = DEFAULT_CARDS }: { id?: string; cards?: LifestyleCard[] }) {
  return (
    <section className="section" id={id}>
      <div className="container lifestyle-grid">
        {cards.map((card) => (
          <article key={card.title} className="lifestyle-card">
            <span className="eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <Link className="btn btn-secondary" href={card.cta.href}>
              {card.cta.label}
            </Link>
            <Image src={card.image.src} alt={card.image.alt} width={500} height={400} />
          </article>
        ))}
      </div>
    </section>
  );
}
