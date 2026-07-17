import { wpFetch } from "@/lib/woocommerce/client";
import { useFixtures } from "@/lib/woocommerce/config";

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
  };
}

export async function getPosts(page = 1, perPage = 12): Promise<{ posts: WPPost[]; totalPages: number }> {
  if (useFixtures) return { posts: [], totalPages: 1 };

  const { data, totalPages } = await wpFetch<WPPost[]>(
    "/posts",
    { page, per_page: perPage, _embed: true },
    { tags: ["posts"] },
  );
  return { posts: data, totalPages };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (useFixtures) return null;

  const { data } = await wpFetch<WPPost[]>("/posts", { slug, _embed: true }, { tags: ["posts"] });
  return data[0] ?? null;
}

export async function getAllPostSlugs(limit = 100): Promise<string[]> {
  try {
    const { data } = await wpFetch<WPPost[]>("/posts", { per_page: limit, _fields: "slug" }, { tags: ["posts"] });
    return data.map((p) => p.slug);
  } catch {
    return [];
  }
}
