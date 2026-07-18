const TRUST_ITEMS = [
  {
    title: "Livraison nationale",
    description: "Expédition et suivi de commande partout au Maroc.",
    icon: (
      <>
        <path d="M3 6h13v11H3zM16 10h3l2 3v4h-5z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
  },
  {
    title: "Produits garantis",
    description: "Des références sélectionnées avec une garantie clairement indiquée.",
    icon: (
      <>
        <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Conseil technique",
    description: "Une aide simple pour choisir une configuration cohérente.",
    icon: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M8 12h8M12 8v8" />
      </>
    ),
  },
  {
    title: "SAV & accompagnement",
    description: "Une équipe disponible pour vous orienter après l'achat.",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
  },
];

/** Static trust block — no Woo data, per brief. */
export function TrustSection({ id }: { id?: string }) {
  return (
    <section className="section" id={id}>
      <div className="container trust-grid">
        {TRUST_ITEMS.map((item) => (
          <article key={item.title} className="trust-card">
            <span className="trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
