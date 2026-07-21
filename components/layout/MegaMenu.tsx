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
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

  const closeCategories = () => {
    setCategoriesOpen(false);
    setActiveCategoryId(null);
  };

  return (
    <header className={cn("site-header", scrolled && "scrolled")}>
      <div className="container header-main">
        <Link className="logo" href="/" aria-label={`${siteConfig.shortName} accueil`}>
          <img src="/inotech_logo_main.svg" alt={siteConfig.shortName} width={150} />
        </Link>

        <SearchBar />
      </div>

      <nav className={cn("category-nav", navOpen && "open")} id="categoryNav" aria-label="Catégories principales">
        <div className="container nav-links">
          <Link className="all-products" href="/shop" onClick={() => setNavOpen(false)}>
            ☰ Tous les produits
          </Link>

          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={closeCategories}
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
              <ul className="categories-list">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="category-item"
                    onMouseEnter={() => setActiveCategoryId(category.id)}
                  >
                    <Link
                      href={categoryHref(category.path)}
                      className={cn("category-link", activeCategoryId === category.id && "active")}
                      onClick={closeCategories}
                    >
                      {category.name}
                      {category.children?.length ? (
                        <svg className="chevron-right" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>

              {activeCategory?.children?.length ? (
                <div className="submenu-panel">
                  <p className="submenu-heading">{activeCategory.name}</p>
                  <ul className="submenu-chips">
                    <li>
                      <Link
                        href={categoryHref(activeCategory.path)}
                        className="submenu-view-all"
                        onClick={closeCategories}
                      >
                        Voir tout
                      </Link>
                    </li>
                    {activeCategory.children.map((child) => (
                      <li key={child.id}>
                        <Link href={categoryHref(child.path)} onClick={closeCategories}>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Link href="/about" onClick={() => setNavOpen(false)}>
            Qui sommes-nous&nbsp;?
          </Link>
          <Link href="/contact" onClick={() => setNavOpen(false)}>
            Contact us
          </Link>
        </div>
      </nav>
    </header>
  );
}