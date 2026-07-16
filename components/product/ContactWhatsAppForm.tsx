"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

export function ContactWhatsAppForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phone = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
    const text = `Bonjour, je suis ${name || "un(e) client(e)"}.\n\n${message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nom
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-border/30 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Message
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded border border-border/30 px-3 py-2"
        />
      </label>
      <Button type="submit" className="self-start">
        Envoyer sur WhatsApp
      </Button>
    </form>
  );
}
