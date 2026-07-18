import { getCategoryTree } from "@/lib/woocommerce/categories";
import { MegaMenu } from "@/components/layout/MegaMenu";
import type { CategoryNode } from "@/lib/woocommerce/types";

async function safeGetCategoryTree(): Promise<CategoryNode[]> {
  try {
    return await getCategoryTree();
  } catch {
    return [];
  }
}

/** Server entry point: fetches the live Woo category tree, hands it to the header shell. */
export async function Header() {
  const categories = await safeGetCategoryTree();
  return <MegaMenu categories={categories} />;
}
