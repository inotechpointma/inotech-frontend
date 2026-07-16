"use client";

import { useState } from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Accordion } from "@/components/ui/Accordion";
import type { CategoryNode } from "@/lib/woocommerce/types";
import { categoryHref } from "@/lib/utils/slug";
import { mainNav } from "@/config/navigation";

export function MobileNav({ categories }: { categories: CategoryNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center lg:hidden"
      >
        <span aria-hidden className="text-xl">
          ☰
        </span>
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Menu">
        <div className="flex flex-col p-4">
          {categories.map((category) =>
            category.children.length > 0 ? (
              <Accordion key={category.id} title={category.name}>
                <ul className="space-y-2 pl-2">
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <Link href={categoryHref(child.path)} onClick={() => setOpen(false)} className="block py-1">
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion>
            ) : (
              <Link
                key={category.id}
                href={categoryHref(category.path)}
                onClick={() => setOpen(false)}
                className="border-b border-border/20 py-3 font-medium"
              >
                {category.name}
              </Link>
            ),
          )}

          <div className="mt-4 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 text-sm text-ink-muted">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
