import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "À propos",
  description: `${siteConfig.name} — ${siteConfig.description}`,
};

export default function AboutPage() {
  return (
    <article className="prose max-w-none">
      <h1>À propos de {siteConfig.name}</h1>
      <p>{siteConfig.description}</p>
      <p>
        Nous proposons une large sélection de PC portables, composants et accessoires
        informatiques, avec un service client réactif joignable directement sur WhatsApp pour
        toute demande d&apos;informations ou de commande.
      </p>
    </article>
  );
}
