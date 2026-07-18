"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { siteConfig } from "@/config/site";
import { categoryHref } from "@/lib/utils/slug";
import { cn } from "@/lib/utils/cn";
import type { CategoryNode } from "@/lib/woocommerce/types";

/**
 * Full header shell — logo, search, tools, and the category nav row — ported from
 * inotech-home.html's .site-header/.header-main/.category-nav. The category list itself is
 * root-level nodes from the live WooCommerce category tree (categories prop, already fetched by
 * Header.tsx), so a new/renamed category shows up automatically, no code change needed.
 */
export function MegaMenu({ categories }: { categories: CategoryNode[] }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("site-header", scrolled && "scrolled")}>
      <div className="container header-main">
        <Link className="logo" href="/" aria-label={`${siteConfig.shortName} accueil`}>
          <span className="logo-mark">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M8 8h16v16H8z" />
              <path d="M12 13h8M12 18h5" />
            </svg>
          </span>
          <span>{siteConfig.shortName}</span>
        </Link>

        <SearchBar />

        <div className="header-tools">
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={navOpen}
            aria-controls="categoryNav"
            aria-label="Ouvrir le menu"
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          {siteConfig.phone ? (
            <a className="header-tool phone-tool" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 13 13 0 0 0 2.9.7 2 2 0 0 1 1.6 1.9Z" />
              </svg>
              <span className="tool-label">Conseil</span>
            </a>
          ) : null}
          <Link className="header-tool account-tool" href="/account">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            <span className="tool-label">Mon compte</span>
          </Link>
        </div>
      </div>

      <nav className={cn("category-nav", navOpen && "open")} id="categoryNav" aria-label="Catégories principales">
        <div className="container">
          <Link className="all-products" href="/shop" onClick={() => setNavOpen(false)}>
            ☰ Tous les produits
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={categoryHref(category.path)} onClick={() => setNavOpen(false)}>
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
