"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={className}>
      <div className="flex h-11 items-center rounded border border-border/30 bg-surface px-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit, une marque..."
          aria-label="Rechercher"
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
        <button type="submit" aria-label="Lancer la recherche" className="text-ink-muted hover:text-brand">
          🔍
        </button>
      </div>
    </form>
  );
}
