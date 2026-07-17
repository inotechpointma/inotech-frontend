import { wooFetch } from "./client";
import { useFixtures } from "./config";
import { FIXTURE_CATEGORIES } from "./fixtures";
import type { CategoryNode, WCCategory } from "./types";

const LIST_PARAMS = { per_page: 100, hide_empty: false } as const;

export async function getAllCategories(): Promise<WCCategory[]> {
  if (useFixtures) return FIXTURE_CATEGORIES;

  const { data } = await wooFetch<WCCategory[]>("/products/categories", LIST_PARAMS, {
    tags: ["categories"],
  });
  // WooCommerce excludes the default "Uncategorized" bucket from the shop taxonomy tree.
  return data.filter((c) => c.slug !== "uncategorized");
}

/** Builds the full category tree with resolved slug paths (e.g. computers/laptops/gaming). */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const all = await getAllCategories();
  const byParent = new Map<number, WCCategory[]>();

  for (const cat of all) {
    const siblings = byParent.get(cat.parent) ?? [];
    siblings.push(cat);
    byParent.set(cat.parent, siblings);
  }

  function build(parentId: number, parentPath: string[]): CategoryNode[] {
    const children = (byParent.get(parentId) ?? []).sort((a, b) => a.menu_order - b.menu_order);
    return children.map((cat) => {
      const path = [...parentPath, cat.slug];
      return { ...cat, path, children: build(cat.id, path) };
    });
  }

  return build(0, []);
}

/** Flattens the tree into a slug-path -> node lookup, used to resolve catch-all routes. */
export async function getCategoryByPath(slugPath: string[]): Promise<CategoryNode | null> {
  const chain = await getCategoryAncestorChain(slugPath);
  return chain.at(-1) ?? null;
}

/**
 * Resolves every ancestor node (root to leaf) for a slug path, so breadcrumbs can show real
 * category names at each level instead of guessing a label from the slug.
 */
export async function getCategoryAncestorChain(slugPath: string[]): Promise<CategoryNode[]> {
  if (slugPath.length === 0) return [];
  const tree = await getCategoryTree();
  const chain: CategoryNode[] = [];

  let level = tree;
  for (const slug of slugPath) {
    const node = level.find((n) => n.slug === slug);
    if (!node) return [];
    chain.push(node);
    level = node.children;
  }

  return chain;
}

export async function getSubcategories(categoryId: number): Promise<WCCategory[]> {
  const { data } = await wooFetch<WCCategory[]>(
    "/products/categories",
    { ...LIST_PARAMS, parent: categoryId },
    { tags: ["categories", `category:${categoryId}`] },
  );
  return data;
}

/** Resolves a category id to its full slug path, for breadcrumbs on product pages. */
export async function getCategoryPathById(categoryId: number): Promise<CategoryNode | null> {
  const tree = await getCategoryTree();

  function find(nodes: CategoryNode[]): CategoryNode | null {
    for (const node of nodes) {
      if (node.id === categoryId) return node;
      const found = find(node.children);
      if (found) return found;
    }
    return null;
  }

  return find(tree);
}

/** All known slug paths in the tree — used by generateStaticParams for the catch-all category route. */
export async function getAllCategoryPaths(): Promise<string[][]> {
  const tree = await getCategoryTree();
  const paths: string[][] = [];

  function walk(nodes: CategoryNode[]) {
    for (const node of nodes) {
      paths.push(node.path);
      walk(node.children);
    }
  }

  walk(tree);
  return paths;
}
