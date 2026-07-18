"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils/format-price";
import { productHref } from "@/lib/utils/slug";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string | null;
}

/** Live suggestions come from the existing /api/search route (lib/woocommerce/products.ts under the hood) — no new fetcher. */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { results: SearchResult[] }) => {
          setResults(data.results ?? []);
          setOpen(true);
        })
        .catch(() => {});
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className={`search-wrap ${className ?? ""}`} ref={wrapRef}>
      <form className="search-box" role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="siteSearch">
          Rechercher un produit
        </label>
        <input
          id="siteSearch"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Rechercher un produit, une marque, une référence…"
        />
        <button type="submit" aria-label="Rechercher">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </form>

      <div className={`search-results ${open ? "open" : ""}`} role="listbox" aria-label="Suggestions de recherche">
        {results.length > 0 ? (
          results.map((item) => (
            <a key={item.id} className="search-result" href={productHref(item.slug)} role="option" aria-selected="false">
              <span>{item.name}</span>
              <strong>{formatPrice(item.price)}</strong>
            </a>
          ))
        ) : query.trim().length >= 2 ? (
          <div className="search-result">
            <span>
              Aucun produit trouvé.
              <small>Essayez une autre recherche.</small>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
