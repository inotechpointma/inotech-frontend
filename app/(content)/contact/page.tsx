import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactWhatsAppForm } from "@/components/product/ContactWhatsAppForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Contact</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Une question sur un produit ou une commande ? Écrivez-nous, nous répondons directement
        sur WhatsApp.
      </p>

      <div className="mb-8 flex flex-col gap-1 text-sm">
        <span>Email : {siteConfig.contactEmail}</span>
        {siteConfig.whatsappNumber ? <span>WhatsApp : +{siteConfig.whatsappNumber}</span> : null}
      </div>

      <ContactWhatsAppForm />
    </div>
  );
}
