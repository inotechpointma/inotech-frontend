"use client";

import { useState } from "react";

/** Product description block with the same "Lire la suite" collapse toggle as SeoSection. */
export function ProductDescription({ html }: { html: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="seo-card">
      <div className={`seo-content ${open ? "open" : ""}`}>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <button className="text-link" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Réduire ↑" : "Lire la suite ↓"}
      </button>
    </div>
  );
}