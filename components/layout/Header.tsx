import Link from "next/link";
import Image from "next/image";
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

/**
 * Two-row header layout cloned from pcportable.ma: a black general row (logo, search,
 * click-to-call, account/wishlist) and a red primary-nav row driven by the live Woo category
 * tree. No cart icon — this storefront is WhatsApp-inquiry only (see
 * components/product/WhatsAppButton.tsx).
 */
export async function Header() {
  const categories = await safeGetCategoryTree();

  return (
    <header className="sticky top-0 z-30 shadow-header">
      <div className="bg-header text-white">
        <div className="container flex h-16 items-center gap-4 lg:h-[95px]">
          <MobileNav categories={categories} />

          <Link href="/" className="flex shrink-0 items-center" aria-label={siteConfig.shortName}>
            <Image src="/logo-light.svg" alt={siteConfig.shortName} width={140} height={35} className="h-8 w-auto" priority />
          </Link>

          <SearchBar className="hidden flex-1 md:block" />

          <div className="ml-auto flex items-center gap-5 text-sm">
            {siteConfig.phone ? (
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hidden flex-col leading-tight lg:flex">
                <span className="text-xs text-white/60">Contactez-nous</span>
                <span className="font-semibold">{siteConfig.phone}</span>
              </a>
            ) : null}
            <Link href="/account" className="flex items-center gap-1" aria-label="Liste de souhaits">
              <span aria-hidden>♡</span>
              <span className="hidden lg:inline">Ma liste de souhaits</span>
            </Link>
            <Link href="/account" className="flex items-center gap-1" aria-label="Mon compte">
              <span aria-hidden>👤</span>
              <span className="hidden lg:inline">Mon compte</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-brand text-white">
        <div className="container flex h-12 items-center lg:h-[50px]">
          <MegaMenu categories={categories} />
        </div>
      </div>

      <div className="container bg-header pb-3 pt-1 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
