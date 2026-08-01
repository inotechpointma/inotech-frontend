"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { siteConfig } from "@/config/site";
import { categoryHref } from "@/lib/utils/slug";
import { cn } from "@/lib/utils/cn";
import type { CategoryNode } from "@/lib/woocommerce/types";

export function MegaMenu({ categories }: { categories: CategoryNode[] }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Ferme tout (menu mobile + dropdown) — utilisé quand on navigue vers un lien
  const closeAll = () => {
    setCategoriesOpen(false);
    setNavOpen(false);
  };

  const closeCategories = () => setCategoriesOpen(false);

  return (
    <header className={cn("site-header", scrolled && "scrolled")}>
      <div className="container header-main">
        <Link className="logo" href="/" aria-label={`${siteConfig.shortName} accueil`} onClick={closeAll}>
          <img src="/inotech_logo_main.svg" alt={siteConfig.shortName} width={150} />
        </Link>

        <SearchBar />

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={navOpen}
          aria-controls="categoryNav"
          aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {navOpen ? (
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <nav className={cn("category-nav", navOpen && "open")} id="categoryNav" aria-label="Navigation principale">
        <div className="container nav-links">
          <Link className="all-products" href="/shop" onClick={closeAll}>
            Boutique
          </Link>

          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => canHover && setCategoriesOpen(true)}
            onMouseLeave={() => canHover && closeCategories()}
          >
            <button
              type="button"
              className="nav-trigger"
              aria-expanded={categoriesOpen}
              aria-controls="categoriesDropdown"
              onClick={() => setCategoriesOpen((v) => !v)}
            >
              Catégories
              <svg
                className={cn("chevron", categoriesOpen && "rotated")}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div id="categoriesDropdown" className={cn("dropdown-panel", categoriesOpen && "open")}>
              <div className="container dropdown-inner mega-grid">
                {categories.map((category) => (
                  <div key={category.id} className="mega-column">
                    <Link
                      href={categoryHref(category.path)}
                      className="mega-column-heading"
                      onClick={closeAll}
                    >
                      {category.name}
                    </Link>

                    <ul className="mega-column-list">
                      <li>
                        <Link
                          href={categoryHref(category.path)}
                          className="mega-view-all"
                          onClick={closeAll}
                        >
                          Voir tout
                        </Link>
                      </li>
                      {category.children?.map((child) => (
                        <li key={child.id}>
                          <Link href={categoryHref(child.path)} onClick={closeAll}>
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" onClick={closeAll}>
            Qui sommes-nous&nbsp;?
          </Link>
          <Link href="/contact" onClick={closeAll}>
            Contact us
          </Link>
        </div>
      </nav>
    </header>
  );
}