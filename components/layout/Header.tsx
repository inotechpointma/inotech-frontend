import Link from "next/link";
import { getCategoryTree } from "@/lib/woocommerce/categories";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { siteConfig } from "@/config/site";
import type { CategoryNode } from "@/lib/woocommerce/types";

async function safeGetCategoryTree(): Promise<CategoryNode[]> {
  try {
    return await getCategoryTree();
  } catch {
    return [];
  }
}

export async function Header() {
  const categories = await safeGetCategoryTree();

  return (
    <header className="sticky top-0 z-30 border-b border-border/20 bg-surface shadow-header">
      <div className="container flex h-16 items-center gap-4">
        <MobileNav categories={categories} />

        <Link href="/" className="shrink-0 text-xl font-bold text-brand">
          {siteConfig.name}
        </Link>

        <SearchBar className="hidden flex-1 md:block" />

        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/account" className="hidden items-center gap-1 md:flex">
            <span aria-hidden>👤</span> Compte
          </Link>
        </div>
      </div>

      <div className="border-t border-border/10">
        <div className="container flex h-12 items-center">
          <MegaMenu categories={categories} />
        </div>
      </div>

      <div className="container pb-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
