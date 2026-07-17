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
      <div className="flex h-11 items-center rounded-pill bg-surface pl-4 pr-1 text-ink">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des produits"
          aria-label="Rechercher"
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
        <button
          type="submit"
          className="h-9 shrink-0 rounded-pill bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
