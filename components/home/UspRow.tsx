const ITEMS = [
  { icon: "🚚", title: "Livraison rapide", text: "Partout au Maroc" },
  { icon: "🛡️", title: "Garantie officielle", text: "Sur tous les produits" },
  { icon: "💬", title: "Commande sur WhatsApp", text: "Sans compte, sans CB" },
  { icon: "🎧", title: "Support dédié", text: "Avant et après achat" },
];

export function UspRow() {
  return (
    <section className="border-y border-border/15 bg-surface-alt">
      <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-ink-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
