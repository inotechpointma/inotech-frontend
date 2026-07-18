"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/** Static/editorial SEO content block with a "Lire la suite" collapse toggle. */
export function SeoSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section">
      <div className="container seo-card">
        <div className={`seo-content ${open ? "open" : ""}`}>
          <h2>{siteConfig.shortName} — matériel informatique et solutions technologiques au Maroc</h2>
          <p>
            {siteConfig.shortName} rassemble une sélection d&apos;ordinateurs portables, PC professionnels,
            équipements gaming, moniteurs, composants, stockage, solutions réseau et accessoires. La structure
            du catalogue permet de rechercher un produit par catégorie, marque, usage ou caractéristique
            technique.
          </p>
          <p>
            Chaque fiche produit peut présenter les informations essentielles à la décision : processeur,
            mémoire, stockage, écran, carte graphique, connectivité, système d&apos;exploitation, disponibilité
            et garantie.
          </p>
          <p>
            Pour les entreprises, les indépendants et les équipes, {siteConfig.shortName} peut proposer des
            configurations adaptées au travail bureautique, au développement, à la création, à la mobilité et
            aux environnements professionnels. Les demandes de devis et de conseil sont orientées vers une
            équipe commerciale.
          </p>
        </div>
        <button className="text-link" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? "Réduire ↑" : "Lire la suite ↓"}
        </button>
      </div>
    </section>
  );
}
