import type { WCProduct } from "@/lib/woocommerce/types";

export function ProductDocuments({ downloads }: { downloads: WCProduct["downloads"] }) {
  if (!downloads || downloads.length === 0) {
    return <p className="text-sm text-ink-muted">Aucun document disponible pour ce produit.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {downloads.map((doc) => (
        <li key={doc.id}>
          <a
            href={doc.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-brand hover:underline"
          >
            <span aria-hidden>📄</span>
            {doc.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
