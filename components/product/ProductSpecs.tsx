import type { WCAttribute } from "@/lib/woocommerce/types";

/**
 * Generic name -> value table driven entirely by product.attributes. A laptop and a headset
 * render through this exact same component; only the attribute data (managed in WooCommerce)
 * differs.
 */
export function ProductSpecs({ attributes }: { attributes: WCAttribute[] }) {
  const visible = attributes.filter((attr) => attr.visible !== false && attr.options.length > 0);

  if (visible.length === 0) {
    return <p className="text-sm text-ink-muted">Aucune spécification renseignée pour ce produit.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {visible.map((attr, index) => (
          <tr key={attr.id ?? attr.name} className={index % 2 === 0 ? "bg-surface-alt" : ""}>
            <th scope="row" className="w-1/3 px-4 py-3 text-left font-medium">
              {attr.name}
            </th>
            <td className="px-4 py-3 text-ink-muted">{attr.options.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
