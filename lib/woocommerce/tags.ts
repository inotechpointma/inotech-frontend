import { wooFetch } from "./client";
import { useFixtures } from "./config";
import type { WCTag } from "./types";

const LIST_PARAMS = { per_page: 100, hide_empty: false } as const;

export async function getTags(): Promise<WCTag[]> {
  if (useFixtures) return [];

  const { data } = await wooFetch<WCTag[]>("/products/tags", LIST_PARAMS, { tags: ["tags"] });
  return data;
}

export async function getTagBySlug(slug: string): Promise<WCTag | null> {
  if (useFixtures) return null;

  const { data } = await wooFetch<WCTag[]>("/products/tags", { slug, hide_empty: false }, { tags: ["tags"] });
  return data[0] ?? null;
}
