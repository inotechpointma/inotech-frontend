import { Accordion } from "@/components/ui/Accordion";
import type { WCProduct } from "@/lib/woocommerce/types";

interface FaqEntry {
  question: string;
  answer: string;
}

/** Reads a `faq` custom field (ACF repeater or similar) from product.meta_data, if present. */
function parseFaq(metaData: WCProduct["meta_data"]): FaqEntry[] {
  const entry = metaData.find((m) => m.key === "faq" || m.key === "_faq");
  if (!entry) return [];

  try {
    const value = typeof entry.value === "string" ? JSON.parse(entry.value) : entry.value;
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is FaqEntry => typeof item?.question === "string" && typeof item?.answer === "string",
    );
  } catch {
    return [];
  }
}

export function ProductFAQ({ metaData }: { metaData: WCProduct["meta_data"] }) {
  const faqs = parseFaq(metaData);

  if (faqs.length === 0) {
    return <p className="text-sm text-ink-muted">Aucune question fréquente pour ce produit.</p>;
  }

  return (
    <div>
      {faqs.map((faq, index) => (
        <Accordion key={index} title={faq.question}>
          <p className="text-sm text-ink-muted">{faq.answer}</p>
        </Accordion>
      ))}
    </div>
  );
}
