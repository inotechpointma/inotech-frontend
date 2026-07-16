"use client";

import { useEffect, useState } from "react";
import { getInquiries, type InquiryEntry } from "@/lib/inquiries/storage";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryEntry[]>([]);

  useEffect(() => {
    setInquiries(getInquiries());
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Mes demandes</h1>

      {inquiries.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Aucune demande envoyée pour le moment. Vos demandes WhatsApp apparaîtront ici.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border/15">
          {inquiries.map((inquiry, index) => (
            <li key={index} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{inquiry.productName}</p>
                {inquiry.sku ? <p className="text-ink-muted">Réf. {inquiry.sku}</p> : null}
              </div>
              <time className="text-ink-muted">{new Date(inquiry.date).toLocaleDateString("fr-FR")}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
