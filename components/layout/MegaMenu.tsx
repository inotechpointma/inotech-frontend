"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryNode } from "@/lib/woocommerce/types";
import { categoryHref } from "@/lib/utils/slug";
import { cn } from "@/lib/utils/cn";

/**
 * Renders straight off the WooCommerce category tree — adding a category/subcategory in Woo
 * makes it appear here automatically, no code change required.
 */
export function MegaMenu({ categories }: { categories: CategoryNode[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (!categories.length) return null;

  return (
    <nav className="hidden lg:block" aria-label="Catégories">
      <ul className="flex items-center gap-1">
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative"
            onMouseEnter={() => setOpenSlug(category.slug)}
            onMouseLeave={() => setOpenSlug((current) => (current === category.slug ? null : current))}
          >
            <Link
              href={categoryHref(category.path)}
              className={cn(
                "flex items-center gap-1 px-3 py-4 text-sm font-medium hover:text-brand",
                openSlug === category.slug && "text-brand",
              )}
            >
              {category.name}
              {category.children.length > 0 ? <span aria-hidden>⌄</span> : null}
            </Link>

            {category.children.length > 0 && openSlug === category.slug ? (
              <div className="absolute left-0 top-full z-40 grid min-w-[560px] grid-cols-3 gap-x-8 gap-y-2 rounded-b border border-t-0 border-border/20 bg-surface p-6 shadow-card">
                {category.children.map((child) => (
                  <div key={child.id}>
                    <Link href={categoryHref(child.path)} className="font-semibold hover:text-brand">
                      {child.name}
                    </Link>
                    {child.children.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {child.children.map((grandchild) => (
                          <li key={grandchild.id}>
                            <Link
                              href={categoryHref(grandchild.path)}
                              className="text-sm text-ink-muted hover:text-brand"
                            >
                              {grandchild.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
